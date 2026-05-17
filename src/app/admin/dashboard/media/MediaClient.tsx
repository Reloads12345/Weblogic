"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  HardDrive,
  ImageIcon,
  Loader2,
  Search,
  ShieldAlert,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAssets, type UploadMode } from "@/components/providers/AssetProvider";
import { UPLOAD_SLOTS } from "@/lib/data";
import { cn } from "@/lib/utils";

type Filter = "all" | "logo" | "hero" | "expertise" | "case" | "client" | "section";

const FILTERS: Filter[] = [
  "all",
  "logo",
  "hero",
  "expertise",
  "case",
  "client",
  "section",
];

/* ──────────────────────────────────────────────────────────
 * Mode helpers — translate the server-reported upload mode
 * into something the admin can read at a glance.
 * ────────────────────────────────────────────────────────── */
function ModeBadge({ mode }: { mode: UploadMode }) {
  const map: Record<
    UploadMode,
    {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      tone: string;
      help: string;
    }
  > = {
    "vercel-blob": {
      label: "Vercel Blob",
      icon: Cloud,
      tone: "border-electric/40 bg-electric/10 text-electric",
      help: "Production uploads persist to Vercel Blob across redeploys.",
    },
    fs: {
      label: "Local filesystem",
      icon: HardDrive,
      tone: "border-white/15 bg-white/[0.04] text-bone/80",
      help: "Local dev: uploads write to /public/uploads. They will NOT ship to production.",
    },
    disabled: {
      label: "Disabled",
      icon: ShieldAlert,
      tone: "border-amber-500/40 bg-amber-500/10 text-amber-300",
      help: "Production uploads disabled. Add BLOB_READ_WRITE_TOKEN in Vercel.",
    },
    "no-blob-token": {
      label: "Disabled — no Blob token",
      icon: ShieldAlert,
      tone: "border-amber-500/40 bg-amber-500/10 text-amber-300",
      help: "Production uploads require BLOB_READ_WRITE_TOKEN. Add it in Vercel → Storage → Blob.",
    },
    unknown: {
      label: "Loading…",
      icon: Loader2,
      tone: "border-white/10 bg-white/[0.02] text-mute",
      help: "Querying server for storage mode.",
    },
  };
  const m = map[mode];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-[0.18em]",
        m.tone,
      )}
      title={m.help}
    >
      <Icon
        className={`h-3.5 w-3.5${mode === "unknown" ? " animate-spin" : ""}`}
      />
      {m.label}
    </span>
  );
}

export default function MediaClient() {
  const {
    assets,
    setAsset,
    clearAsset,
    isUploading,
    uploadMode,
    manifestLoading,
    lastError,
  } = useAssets();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState<Record<string, boolean>>({});

  const slots = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return UPLOAD_SLOTS.filter(
      (s) =>
        (filter === "all" || s.group === filter) &&
        (!lower ||
          s.label.toLowerCase().includes(lower) ||
          s.key.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower)),
    );
  }, [filter, query]);

  // Counter logic: count required slots whose manifest record has a URL.
  const requiredSlotIds = UPLOAD_SLOTS.map((s) => s.key);
  const filledCount = requiredSlotIds.filter(
    (k) => Boolean(assets[k]?.url),
  ).length;

  const productionBlocked =
    uploadMode === "disabled" || uploadMode === "no-blob-token";

  return (
    <AdminGate>
      <AdminLayout
        title="Media Library"
        subtitle={`${filledCount} / ${UPLOAD_SLOTS.length} slots filled`}
      >
        {/* DIAGNOSTICS PANEL — always visible so the admin knows the state */}
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-ink-0/40 px-5 py-3 text-xs">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Diagnostics
          </span>
          <ModeBadge mode={uploadMode} />
          <span className="text-mute">
            Manifest:{" "}
            <span className="text-bone">
              {manifestLoading
                ? "loading…"
                : `${Object.keys(assets).length} entries`}
            </span>
          </span>
          <span className="text-mute">
            Required slots:{" "}
            <span className="text-bone">{UPLOAD_SLOTS.length}</span>
          </span>
          <span className="text-mute">
            Filled:{" "}
            <span className="text-bone">{filledCount}</span>
          </span>
        </div>

        {/* Hard warning if production uploads are blocked */}
        {productionBlocked && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] px-5 py-4 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
            <div className="space-y-1 text-amber-200">
              <p className="font-semibold">
                Production uploads are disabled.
              </p>
              <p className="text-amber-200/80">
                Add{" "}
                <code className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[11px]">
                  BLOB_READ_WRITE_TOKEN
                </code>{" "}
                in Vercel → Storage → Blob → Create Store, then redeploy. As a
                workaround, drop files into{" "}
                <code className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[11px]">
                  /public/media/work/
                </code>{" "}
                and{" "}
                <code className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[11px]">
                  /public/brand/
                </code>{" "}
                and commit.
              </p>
            </div>
          </div>
        )}

        {/* Last error from upload / fetch — surfaced so failures aren't silent */}
        {lastError && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/[0.06] px-5 py-4 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
            <div className="space-y-1 text-red-200">
              <p className="font-semibold">Last operation failed</p>
              <p className="text-red-200/80">{lastError}</p>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/8 pb-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mute" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search slots…"
              className="w-72 rounded-full border border-white/12 bg-ink-50/60 pl-9 pr-4 py-2 text-sm text-bone placeholder:text-white/30 focus:border-electric focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.16em]">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 transition",
                  filter === f
                    ? "border-electric bg-electric/10 text-electric"
                    : "border-white/10 text-white/55 hover:border-white/30 hover:text-white",
                )}
              >
                {f}
                {f !== "all" && (
                  <span className="ml-2 text-mute">
                    · {UPLOAD_SLOTS.filter((s) => s.group === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {slots.map((slot) => {
            const filled = assets[slot.key];
            const uploading = isUploading === slot.key;
            const isDragOver = dragOver === slot.key;
            const previewBroken = previewFailed[slot.key];

            return (
              <li
                key={slot.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(slot.key);
                }}
                onDragLeave={() =>
                  setDragOver((d) => (d === slot.key ? null : d))
                }
                onDrop={async (e) => {
                  e.preventDefault();
                  setDragOver(null);
                  if (productionBlocked) return;
                  const f = e.dataTransfer.files?.[0];
                  if (f) await setAsset(slot.key, f);
                }}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-2xl border bg-ink-50/40 transition-all duration-300",
                  isDragOver
                    ? "border-electric bg-electric/5 shadow-[0_0_0_4px_rgba(0,82,255,0.18)]"
                    : "border-white/10 hover:border-white/25",
                )}
              >
                {/* Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                  {filled?.url && !previewBroken ? (
                    filled.type === "video" ? (
                      <video
                        src={filled.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        onError={() =>
                          setPreviewFailed((p) => ({ ...p, [slot.key]: true }))
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : filled.type === "document" ? (
                      <div className="absolute inset-0 grid place-items-center p-6 text-center text-white/65">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric">
                            PDF
                          </p>
                          <a
                            href={filled.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block break-all text-sm text-electric underline-offset-2 hover:underline"
                          >
                            Open document
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* image */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={filled.url}
                        alt={slot.label}
                        onError={() =>
                          setPreviewFailed((p) => ({ ...p, [slot.key]: true }))
                        }
                        onLoad={() =>
                          console.log(
                            "[media-admin] preview_loaded",
                            JSON.stringify({ slot: slot.key }),
                          )
                        }
                        className="absolute inset-0 h-full w-full object-contain p-4"
                      />
                    )
                  ) : filled?.url && previewBroken ? (
                    /* Preview load error — never silently show "empty" if a URL exists */
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-xs">
                      <AlertCircle className="h-5 w-5 text-amber-400" />
                      <p className="text-amber-200">Preview failed to load</p>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(filled.url);
                        }}
                        className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-mute hover:border-white/25 hover:text-bone"
                      >
                        Copy URL
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-white/25">
                      {slot.accept.includes("video") ? (
                        <Video className="h-8 w-8" />
                      ) : (
                        <ImageIcon className="h-8 w-8" />
                      )}
                    </div>
                  )}
                  {filled?.url && !previewBroken && (
                    <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-electric">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </span>
                  )}
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-ink-100/70 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white/65 backdrop-blur">
                    {slot.group}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="truncate font-medium text-bone">{slot.label}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-mute">
                    {slot.description}
                  </p>
                  <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.16em] text-white/40">
                    {slot.recommended}
                  </p>

                  {/* Actions */}
                  <div className="mt-5 flex items-center gap-2">
                    <label
                      className={cn(
                        "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] transition",
                        productionBlocked
                          ? "cursor-not-allowed border-white/8 text-white/30"
                          : filled
                            ? "cursor-pointer border-white/12 text-white/75 hover:border-white/30 hover:text-white"
                            : "cursor-pointer border-electric/40 text-electric hover:border-electric hover:bg-electric/10",
                      )}
                    >
                      {uploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="h-3.5 w-3.5" />
                      )}
                      {uploading
                        ? "Uploading…"
                        : filled
                          ? "Replace"
                          : productionBlocked
                            ? "Disabled"
                            : "Upload"}
                      <input
                        type="file"
                        accept={slot.accept}
                        disabled={productionBlocked}
                        className="sr-only"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setPreviewFailed((p) => ({ ...p, [slot.key]: false }));
                            await setAsset(slot.key, f);
                          }
                        }}
                      />
                    </label>
                    {filled && !productionBlocked && (
                      <button
                        type="button"
                        onClick={() => clearAsset(slot.key)}
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/55 transition hover:border-red-500/40 hover:text-red-400"
                        aria-label="Remove asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {filled?.url && (
                    <p className="mt-3 truncate text-[10px] font-mono text-mute">
                      {filled.url}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {slots.length === 0 && (
          <p className="py-16 text-center text-sm text-mute">
            No slots match this filter.
          </p>
        )}
      </AdminLayout>
    </AdminGate>
  );
}
