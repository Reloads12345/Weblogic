import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { promises as fs } from "node:fs";
import { del, list, put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────── Strategy ───────────────────────
 *
 * This route runs in TWO modes depending on the environment:
 *
 *   • PRODUCTION (Vercel) — files + manifest stored in Vercel Blob.
 *       Requires BLOB_READ_WRITE_TOKEN. Without it the route returns
 *       503 with an actionable message instead of crashing.
 *
 *   • LOCAL DEV — files written to /public/uploads + manifest.json on
 *       disk, same as before. Lets you iterate quickly without burning
 *       Blob storage.
 *
 * The shape of the response is identical in both modes so the
 * AssetProvider client doesn't need to know which storage is active.
 *
 * Validation:
 *   - File type allowlist (images, video, PDF)
 *   - Size cap (30MB)
 *   - Slot key sanitized to [A-Za-z0-9_-]{1,64}
 */

const IS_VERCEL = process.env.VERCEL === "1";
const HAS_BLOB_TOKEN = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MANIFEST = path.join(UPLOAD_DIR, "manifest.json");

const VALID_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];
const VALID_IMAGE = [
  "image/svg+xml",
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

// Canonical manifest path in Vercel Blob. Stable across redeploys.
const MANIFEST_BLOB_KEY = "media/manifest.json";

/* ─────────────────────── Storage backends ─────────────────────── */

async function readManifestFs(): Promise<Manifest> {
  try {
    const buf = await fs.readFile(MANIFEST, "utf8");
    return JSON.parse(buf) as Manifest;
  } catch {
    return {};
  }
}

async function writeManifestFs(m: Manifest) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(m, null, 2), "utf8");
}

async function readManifestBlob(): Promise<Manifest> {
  try {
    // Find the existing manifest blob (it lives at /manifest.json)
    const { blobs } = await list({ prefix: MANIFEST_BLOB_KEY });
    const entry = blobs.find((b) => b.pathname === MANIFEST_BLOB_KEY);
    if (!entry) return {};
    const res = await fetch(entry.url, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as Manifest;
  } catch (err) {
    console.error("[upload] manifest read (blob) failed:", err);
    return {};
  }
}

async function writeManifestBlob(m: Manifest) {
  await put(MANIFEST_BLOB_KEY, JSON.stringify(m, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readManifest(): Promise<Manifest> {
  if (IS_VERCEL && HAS_BLOB_TOKEN) return readManifestBlob();
  return readManifestFs();
}

async function writeManifest(m: Manifest) {
  if (IS_VERCEL && HAS_BLOB_TOKEN) return writeManifestBlob(m);
  return writeManifestFs(m);
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

/* ─────────────────────── GET ─────────────────────── */

export async function GET() {
  // Reads work everywhere — local fs in dev, Blob in prod (if configured).
  // On Vercel without a token we just return an empty registry.
  if (IS_VERCEL && !HAS_BLOB_TOKEN) {
    return NextResponse.json({ assets: {}, mode: "no-blob-token" });
  }
  const manifest = await readManifest();
  return NextResponse.json({
    assets: manifest,
    // String values here MUST stay in lock-step with the UploadMode union
    // in AssetProvider.tsx. "blob" used to be returned here — that didn't
    // match the client's `"vercel-blob"` key in MediaClient's ModeBadge
    // map, which caused a "Cannot read properties of undefined (reading
    // 'icon')" crash in the admin console.
    mode: IS_VERCEL ? "vercel-blob" : "fs",
  });
}

/* ─────────────────────── POST (upload) ─────────────────────── */

export async function POST(req: NextRequest) {
  console.log("[media] upload_received");
  if (IS_VERCEL && !HAS_BLOB_TOKEN) return productionUnconfigured();

  try {
    const form = await req.formData();
    const file = form.get("file");
    // Accept both `slot` (legacy) and `slotId` (spec'd) field names.
    const slotRaw =
      form.get("slotId") ??
      form.get("slot");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 },
      );
    }
    if (typeof slotRaw !== "string" || !slotRaw.trim()) {
      return NextResponse.json(
        { error: "Missing slotId" },
        { status: 400 },
      );
    }
    const slot = safeSlot(slotRaw);
    if (!slot) {
      return NextResponse.json(
        { error: "Invalid slotId" },
        { status: 400 },
      );
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
    const filename = `${slot}.${ext}`;

    let entry: ManifestEntry;

    if (IS_VERCEL && HAS_BLOB_TOKEN) {
      /* ─── Vercel Blob upload ─── */
      // Files live under media/{slot}.{ext} so the manifest + assets share
      // a tidy prefix and we can list/clean orphans efficiently.
      const blobPath = `media/${filename}`;

      // Delete previous file at this slot key (any extension).
      try {
        const { blobs } = await list({ prefix: `media/${slot}.` });
        for (const b of blobs) {
          if (b.pathname !== blobPath) {
            await del(b.url).catch(() => {});
          }
        }
      } catch {
        // listing failures are non-fatal — worst case we have an orphan
      }

      const blob = await put(blobPath, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      console.log("[media] blob_upload_success", JSON.stringify({ slot, path: blobPath }));

      entry = {
        url: blob.url,
        type: isVideo ? "video" : isImage ? "image" : "document",
        uploadedAt: Date.now(),
      };
    } else {
      /* ─── Local filesystem (dev) ─── */
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const existing = await fs.readdir(UPLOAD_DIR).catch(() => []);
      for (const f of existing) {
        if (f.startsWith(`${slot}.`) && f !== filename) {
          await fs.unlink(path.join(UPLOAD_DIR, f)).catch(() => {});
        }
      }
      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(UPLOAD_DIR, filename), buf);
      entry = {
        url: `/uploads/${filename}`,
        type: isVideo ? "video" : isImage ? "image" : "document",
        uploadedAt: Date.now(),
      };
    }

    const manifest = await readManifest();
    manifest[slot] = entry;
    await writeManifest(manifest);
    console.log("[media] manifest_save_success", JSON.stringify({ slot }));
    console.log("[media] upload_complete", JSON.stringify({ slot, type: entry.type }));

    return NextResponse.json({
      ok: true,
      slot,
      slotId: slot,
      url: entry.url,
      pathname:
        IS_VERCEL && HAS_BLOB_TOKEN ? `media/${filename}` : entry.url,
      filename,
      contentType: file.type,
      size: file.size,
      type: entry.type,
      uploadedAt: entry.uploadedAt,
      source: IS_VERCEL && HAS_BLOB_TOKEN ? "vercel-blob" : "filesystem",
    });
  } catch (err) {
    console.error("[media] upload_failed", err);
    return NextResponse.json(
      { error: "Upload failed. See server logs." },
      { status: 500 },
    );
  }
}

/* ─────────────────────── DELETE ─────────────────────── */

export async function DELETE(req: NextRequest) {
  if (IS_VERCEL && !HAS_BLOB_TOKEN) return productionUnconfigured();

  const url = new URL(req.url);
  const slotRaw = url.searchParams.get("slot");
  if (!slotRaw) {
    return NextResponse.json({ error: "Missing slot" }, { status: 400 });
  }
  const slot = safeSlot(slotRaw);

  const manifest = await readManifest();
  const entry = manifest[slot];
  if (!entry) {
    return NextResponse.json({ ok: true, note: "nothing-to-delete" });
  }

  try {
    if (IS_VERCEL && HAS_BLOB_TOKEN) {
      await del(entry.url).catch(() => {});
    } else {
      const filename = path.basename(entry.url);
      await fs.unlink(path.join(UPLOAD_DIR, filename)).catch(() => {});
    }
  } catch (err) {
    console.error("[upload] delete failed:", err);
  }

  delete manifest[slot];
  await writeManifest(manifest);
  return NextResponse.json({ ok: true });
}
