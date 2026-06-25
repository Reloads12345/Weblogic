import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { promises as fs } from "node:fs";
import { del, list, put } from "@vercel/blob";
import { checkAdmin } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────── Strategy ───────────────────────
 *
 * NEW (after the "upload one video, another disappears" bug):
 * we no longer store a separate manifest.json blob. Instead the
 * manifest is DERIVED from listing the blob directory (production)
 * or the filesystem (local). Vercel Blob's docs guarantee that
 * `list()` is immediately consistent after a `put()`, so we never
 * see a stale view — and we eliminate the read-modify-write race
 * on the manifest file that was wiping entries when uploads
 * happened in quick succession.
 *
 * Trade-off: we walk the directory on every request. With ~45
 * slots this is microseconds; if we ever scale past hundreds we
 * can move to Vercel KV.
 *
 * Modes:
 *   • Vercel + BLOB_READ_WRITE_TOKEN → blob storage
 *   • Local dev → /public/uploads filesystem
 *   • Vercel without token → returns 503 with actionable message
 */

const IS_VERCEL = process.env.VERCEL === "1";
const HAS_BLOB_TOKEN = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const VALID_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];
// NOTE: image/svg+xml is intentionally NOT allowed. SVGs can embed
// <script>, so an uploaded SVG is a stored-XSS vector if ever rendered
// same-origin. The brand logo is a committed PNG and admin media is
// raster/video, so nothing legitimate needs SVG upload. Re-add only if a
// real need appears AND the file is sanitized (e.g. DOMPurify) first.
const VALID_IMAGE = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
];
const VALID_DOC = ["application/pdf"];
const MAX_BYTES = 30 * 1024 * 1024; // 30 MB

interface ManifestEntry {
  url: string;
  type: "video" | "image" | "document";
  uploadedAt: number;
}
type Manifest = Record<string, ManifestEntry>;

const BLOB_PREFIX = "media/";

/* ─────────────────────── Derivation (the fix) ─────────────────────── */

function inferTypeFromExt(ext: string): ManifestEntry["type"] {
  const e = ext.toLowerCase();
  if (["mp4", "webm", "mov"].includes(e)) return "video";
  if (e === "pdf") return "document";
  return "image";
}

/**
 * Build the manifest from the actual storage state. There is no separate
 * manifest file to read — the source of truth IS the directory listing,
 * which Vercel Blob keeps immediately consistent after a put().
 */
async function buildManifest(): Promise<Manifest> {
  if (IS_VERCEL && HAS_BLOB_TOKEN) {
    return buildManifestFromBlob();
  }
  return buildManifestFromFs();
}

/**
 * Extract the slot key from a stored filename.
 *
 * We use a `slot__<timestamp>.<ext>` naming convention so each upload
 * creates a UNIQUE URL — that way Vercel Blob's CDN serves a different
 * cache entry per upload, and we never need a `?_v=` query string
 * (which broke video playback because the CDN handles videos via byte-
 * range requests that don't play nicely with arbitrary query strings).
 *
 * Falls back to the legacy `slot.<ext>` shape for files committed before
 * the migration.
 */
function slotFromFilename(filename: string): string | null {
  const dotIdx = filename.lastIndexOf(".");
  if (dotIdx <= 0) return null;
  const base = filename.slice(0, dotIdx);
  const dunderIdx = base.indexOf("__");
  return dunderIdx > 0 ? base.slice(0, dunderIdx) : base;
}

async function buildManifestFromBlob(): Promise<Manifest> {
  const m: Manifest = {};
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 1000 });
    // Sort newest first so when two files exist for the same slot (e.g.
    // mid-replacement), the newer one wins.
    const sorted = [...blobs].sort((a, b) => {
      const aTs = a.uploadedAt instanceof Date ? a.uploadedAt.getTime() : 0;
      const bTs = b.uploadedAt instanceof Date ? b.uploadedAt.getTime() : 0;
      return bTs - aTs;
    });
    for (const b of sorted) {
      const filename = b.pathname.startsWith(BLOB_PREFIX)
        ? b.pathname.slice(BLOB_PREFIX.length)
        : b.pathname;
      if (filename === "manifest.json") continue;
      const slot = slotFromFilename(filename);
      if (!slot) continue;
      // First entry per slot (which is the newest because we sorted) wins.
      if (m[slot]) continue;
      const ext = filename.slice(filename.lastIndexOf(".") + 1);
      const uploadedAt =
        b.uploadedAt instanceof Date ? b.uploadedAt.getTime() : Date.now();
      m[slot] = {
        url: b.url,
        type: inferTypeFromExt(ext),
        uploadedAt,
      };
    }
  } catch (err) {
    console.error("[media] buildManifestFromBlob failed", err);
  }
  return m;
}

async function buildManifestFromFs(): Promise<Manifest> {
  const m: Manifest = {};
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    // Sort by mtime so newest version of a slot wins.
    const annotated = await Promise.all(
      files.map(async (f) => {
        const full = path.join(UPLOAD_DIR, f);
        const stat = await fs.stat(full).catch(() => null);
        return { f, mtime: stat?.mtimeMs ?? 0 };
      }),
    );
    annotated.sort((a, b) => b.mtime - a.mtime);
    for (const { f, mtime } of annotated) {
      if (f === "manifest.json" || f === ".gitkeep") continue;
      const slot = slotFromFilename(f);
      if (!slot) continue;
      if (m[slot]) continue;
      const ext = f.slice(f.lastIndexOf(".") + 1);
      m[slot] = {
        url: `/uploads/${f}`,
        type: inferTypeFromExt(ext),
        uploadedAt: mtime || Date.now(),
      };
    }
  } catch {
    // upload dir doesn't exist yet — fine
  }
  return m;
}

/* ─────────────────────── Helpers ─────────────────────── */

function extFromMime(mime: string): string {
  switch (mime) {
    case "video/mp4": return "mp4";
    case "video/webm": return "webm";
    case "video/quicktime": return "mov";
    case "image/svg+xml": return "svg";
    case "image/png": return "png";
    case "image/jpeg": return "jpg";
    case "image/webp": return "webp";
    case "image/avif": return "avif";
    case "application/pdf": return "pdf";
    default: return "bin";
  }
}

function safeSlot(slot: string) {
  return slot.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
}

function productionUnconfigured() {
  return NextResponse.json(
    {
      error:
        "Production uploads require BLOB_READ_WRITE_TOKEN in Vercel. Add it under Settings → Environment Variables (Vercel → Storage → Blob), redeploy, then try again.",
      code: "BLOB_TOKEN_MISSING",
    },
    { status: 503 },
  );
}

/* ─────────────────────── GET (read manifest) ───────────────────────
 *
 * GET is public-readable. The values exposed are public URLs that the
 * marketing pages already render — there's nothing private here.
 * Authenticating GET would also break the public AssetProvider, which
 * fetches this endpoint on every visit to wire admin-uploaded media into
 * the homepage.
 *
 * POST / DELETE are admin-only (see below).
 * ────────────────────────────────────────────────────────────────── */

export async function GET() {
  if (IS_VERCEL && !HAS_BLOB_TOKEN) {
    return NextResponse.json({ assets: {}, mode: "no-blob-token" });
  }
  const manifest = await buildManifest();
  return NextResponse.json({
    assets: manifest,
    mode: IS_VERCEL ? "vercel-blob" : "fs",
  });
}

/* ─────────────────────── POST (upload, admin-only) ─────────────────── */

export async function POST(req: NextRequest) {
  // Authenticate FIRST so we never even parse a form body for anonymous
  // callers (saves bandwidth + Lambda time on hostile traffic).
  const unauthorized = checkAdmin(req);
  if (unauthorized) {
    return NextResponse.json(unauthorized.body, { status: unauthorized.status });
  }

  console.log("[media] upload_received");
  if (IS_VERCEL && !HAS_BLOB_TOKEN) return productionUnconfigured();

  try {
    const form = await req.formData();
    const file = form.get("file");
    const slotRaw = form.get("slotId") ?? form.get("slot");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (typeof slotRaw !== "string" || !slotRaw.trim()) {
      return NextResponse.json({ error: "Missing slotId" }, { status: 400 });
    }
    const slot = safeSlot(slotRaw);
    if (!slot) {
      return NextResponse.json({ error: "Invalid slotId" }, { status: 400 });
    }

    const isVideo = VALID_VIDEO.includes(file.type);
    const isImage = VALID_IMAGE.includes(file.type);
    const isDoc = VALID_DOC.includes(file.type);
    if (!isVideo && !isImage && !isDoc) {
      return NextResponse.json(
        { error: `Unsupported type ${file.type}` },
        { status: 415 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 30MB)" },
        { status: 413 },
      );
    }

    const ext = extFromMime(file.type);
    // Unique filename per upload — `slot__<ts>.<ext>` — so each replace
    // gets a brand-new URL. No `?_v=` query strings needed (those were
    // breaking video playback on Vercel Blob's CDN).
    const uploadTs = Date.now();
    const filename = `${slot}__${uploadTs}.${ext}`;
    let entry: ManifestEntry;

    if (IS_VERCEL && HAS_BLOB_TOKEN) {
      /* ─── Vercel Blob upload ─── */
      const blobPath = `${BLOB_PREFIX}${filename}`;

      // Delete EVERY previous file belonging to this slot:
      //   - legacy `media/<slot>.<ext>`
      //   - new    `media/<slot>__<oldTs>.<ext>`
      try {
        const [legacy, versioned] = await Promise.all([
          list({ prefix: `${BLOB_PREFIX}${slot}.` }),
          list({ prefix: `${BLOB_PREFIX}${slot}__` }),
        ]);
        const all = [...legacy.blobs, ...versioned.blobs];
        for (const b of all) {
          if (b.pathname !== blobPath) {
            await del(b.url).catch(() => {});
          }
        }
      } catch {
        // listing failures non-fatal — orphans just sit in storage
      }

      const blob = await put(blobPath, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      console.log(
        "[media] blob_upload_success",
        JSON.stringify({ slot, path: blobPath }),
      );

      entry = {
        url: blob.url,
        type: isVideo ? "video" : isImage ? "image" : "document",
        uploadedAt: uploadTs,
      };
    } else {
      /* ─── Local filesystem (dev) ─── */
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const existing = await fs.readdir(UPLOAD_DIR).catch(() => []);
      for (const f of existing) {
        if (
          (f.startsWith(`${slot}.`) || f.startsWith(`${slot}__`)) &&
          f !== filename
        ) {
          await fs.unlink(path.join(UPLOAD_DIR, f)).catch(() => {});
        }
      }
      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(UPLOAD_DIR, filename), buf);
      entry = {
        url: `/uploads/${filename}`,
        type: isVideo ? "video" : isImage ? "image" : "document",
        uploadedAt: uploadTs,
      };
    }

    // Rebuild the manifest FROM STORAGE — guarantees no entries are
    // dropped by a stale read of a separate manifest file.
    const manifest = await buildManifest();
    console.log(
      "[media] upload_complete",
      JSON.stringify({ slot, type: entry.type, totalSlots: Object.keys(manifest).length }),
    );

    return NextResponse.json({
      ok: true,
      slot,
      slotId: slot,
      url: entry.url,
      pathname:
        IS_VERCEL && HAS_BLOB_TOKEN ? `${BLOB_PREFIX}${filename}` : entry.url,
      filename,
      contentType: file.type,
      size: file.size,
      type: entry.type,
      uploadedAt: entry.uploadedAt,
      source: IS_VERCEL && HAS_BLOB_TOKEN ? "vercel-blob" : "filesystem",
      manifest,
      mode: IS_VERCEL ? "vercel-blob" : "fs",
    });
  } catch (err) {
    console.error("[media] upload_failed", err);
    return NextResponse.json(
      { error: "Upload failed. See server logs." },
      { status: 500 },
    );
  }
}

/* ─────────────────────── DELETE (admin-only) ─────────────────────── */

export async function DELETE(req: NextRequest) {
  const unauthorized = checkAdmin(req);
  if (unauthorized) {
    return NextResponse.json(unauthorized.body, { status: unauthorized.status });
  }
  if (IS_VERCEL && !HAS_BLOB_TOKEN) return productionUnconfigured();

  const url = new URL(req.url);
  const slotRaw = url.searchParams.get("slot") ?? url.searchParams.get("slotId");
  if (!slotRaw) {
    return NextResponse.json({ error: "Missing slot" }, { status: 400 });
  }
  const slot = safeSlot(slotRaw);

  try {
    if (IS_VERCEL && HAS_BLOB_TOKEN) {
      // Delete every file belonging to this slot — both naming conventions.
      const [legacy, versioned] = await Promise.all([
        list({ prefix: `${BLOB_PREFIX}${slot}.` }),
        list({ prefix: `${BLOB_PREFIX}${slot}__` }),
      ]);
      const all = [...legacy.blobs, ...versioned.blobs];
      for (const b of all) {
        await del(b.url).catch(() => {});
      }
    } else {
      const files = await fs.readdir(UPLOAD_DIR).catch(() => []);
      for (const f of files) {
        if (f.startsWith(`${slot}.`) || f.startsWith(`${slot}__`)) {
          await fs.unlink(path.join(UPLOAD_DIR, f)).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.error("[media] delete failed:", err);
  }

  // Rebuild from storage so the client gets ground truth, not a stale read.
  const manifest = await buildManifest();
  return NextResponse.json({
    ok: true,
    manifest,
    mode: IS_VERCEL ? "vercel-blob" : "fs",
  });
}
