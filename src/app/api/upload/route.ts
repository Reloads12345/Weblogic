import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { promises as fs } from "node:fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MANIFEST = path.join(UPLOAD_DIR, "manifest.json");

/**
 * Vercel's runtime filesystem is READ-ONLY. Any POST/DELETE attempt from
 * the admin UI in production will throw EROFS or EACCES. We detect that
 * environment up-front and return a 503 with a clear, actionable message
 * instead of an opaque 500. Reads (GET) still work because they only need
 * to read files baked into the deploy.
 *
 * To unblock writes in production, swap this file's fs.writeFile/unlink
 * calls for Vercel Blob (`@vercel/blob`) — see /docs in the audit.
 */
const IS_VERCEL_PROD =
  process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

function readOnlyResponse() {
  return NextResponse.json(
    {
      error:
        "Asset uploads need to be migrated to Vercel Blob for production. " +
        "The admin upload endpoint is read-only on Vercel until that's wired in. " +
        "Run admin uploads locally for now.",
      code: "READ_ONLY_FS",
    },
    { status: 503 },
  );
}

const VALID_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];
const VALID_IMAGE = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"];
const VALID_DOC = ["application/pdf"];

const MAX_BYTES = 30 * 1024 * 1024; // 30MB hard ceiling

interface ManifestEntry {
  url: string;
  type: "video" | "image" | "document";
  uploadedAt: number;
}
type Manifest = Record<string, ManifestEntry>;

async function readManifest(): Promise<Manifest> {
  try {
    const buf = await fs.readFile(MANIFEST, "utf8");
    return JSON.parse(buf) as Manifest;
  } catch {
    return {};
  }
}

async function writeManifest(m: Manifest) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(m, null, 2), "utf8");
}

function extFromMime(mime: string): string {
  switch (mime) {
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    case "video/quicktime":
      return "mov";
    case "image/svg+xml":
      return "svg";
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

function safeSlot(slot: string) {
  // alphanumerics + hyphen + underscore only
  return slot.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
}

export async function GET() {
  const manifest = await readManifest();
  return NextResponse.json({ assets: manifest });
}

export async function POST(req: NextRequest) {
  if (IS_VERCEL_PROD) return readOnlyResponse();
  try {
    const form = await req.formData();
    const file = form.get("file");
    const slotRaw = form.get("slot");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (typeof slotRaw !== "string") {
      return NextResponse.json({ error: "Missing slot" }, { status: 400 });
    }
    const slot = safeSlot(slotRaw);
    if (!slot) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    const isVideo = VALID_VIDEO.includes(file.type);
    const isImage = VALID_IMAGE.includes(file.type);
    const isDoc = VALID_DOC.includes(file.type);
    if (!isVideo && !isImage && !isDoc) {
      return NextResponse.json({ error: `Unsupported type ${file.type}` }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 30MB)" }, { status: 413 });
    }

    const ext = extFromMime(file.type);
    const filename = `${slot}.${ext}`;
    const fullPath = path.join(UPLOAD_DIR, filename);

    // Make sure dir exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Clear any other-extension version of this slot first
    const existing = await fs.readdir(UPLOAD_DIR).catch(() => []);
    for (const f of existing) {
      if (f.startsWith(`${slot}.`) && f !== filename) {
        await fs.unlink(path.join(UPLOAD_DIR, f)).catch(() => {});
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(fullPath, Buffer.from(arrayBuffer));

    const manifest = await readManifest();
    const entry: ManifestEntry = {
      url: `/uploads/${filename}`,
      type: isVideo ? "video" : isImage ? "image" : "document",
      uploadedAt: Date.now(),
    };
    manifest[slot] = entry;
    await writeManifest(manifest);

    return NextResponse.json({ ok: true, slot, ...entry });
  } catch (err) {
    console.error("[upload] error", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (IS_VERCEL_PROD) return readOnlyResponse();
  const url = new URL(req.url);
  const slotRaw = url.searchParams.get("slot");
  if (!slotRaw) return NextResponse.json({ error: "Missing slot" }, { status: 400 });
  const slot = safeSlot(slotRaw);

  const manifest = await readManifest();
  const entry = manifest[slot];
  if (entry) {
    const filename = path.basename(entry.url);
    const full = path.join(UPLOAD_DIR, filename);
    await fs.unlink(full).catch(() => {});
    delete manifest[slot];
    await writeManifest(manifest);
  }
  return NextResponse.json({ ok: true });
}
