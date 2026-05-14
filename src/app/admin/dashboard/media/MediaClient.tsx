"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ImageIcon, Loader2, Search, Trash2, UploadCloud, Video } from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAssets } from "@/components/providers/AssetProvider";
import { UPLOAD_SLOTS } from "@/lib/data";
import { cn } from "@/lib/utils";

type Filter = "all" | "logo" | "hero" | "expertise" | "case" | "client" | "section";

const FILTERS: Filter[] = ["all", "logo", "hero", "expertise", "case", "client", "section"];

export default function MediaClient() {
  const { assets, setAsset, clearAsset, isUploading } = useAssets();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [dragOver, setDragOver] = useState<string | null>(null);

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

  const filledCount = Object.keys(assets).length;

  return (
    <AdminGate>
      <AdminLayout
        title="Media Library"
        subtitle={`Drag-and-drop or click any slot. ${filledCount} / ${UPLOAD_SLOTS.length} slots filled.`}
      >
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

            return (
              <li
                key={slot.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(slot.key);
                }}
                onDragLeave={() => setDragOver((d) => (d === slot.key ? null : d))}
                onDrop={async (e) => {
                  e.preventDefault();
                  setDragOver(null);
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
                  {filled?.type === "video" ? (
                    <video
                      src={filled.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : filled?.type === "image" ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={filled.url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-contain p-4"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-white/25">
                      {slot.accept.includes("video") ? (
                        <Video className="h-8 w-8" />
                      ) : (
                        <ImageIcon className="h-8 w-8" />
                      )}
                    </div>
                  )}
                  {filled && (
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
                        "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] transition",
                        filled
                          ? "border-white/12 text-white/75 hover:border-white/30 hover:text-white"
                          : "border-electric/40 text-electric hover:border-electric hover:bg-electric/10",
                      )}
                    >
                      {uploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="h-3.5 w-3.5" />
                      )}
                      {uploading ? "Uploading…" : filled ? "Replace" : "Upload"}
                      <input
                        type="file"
                        accept={slot.accept}
                        className="sr-only"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) await setAsset(slot.key, f);
                        }}
                      />
                    </label>
                    {filled && (
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
