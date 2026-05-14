"use client";

import { useState } from "react";
import { useAssets } from "@/components/providers/AssetProvider";
import { UPLOAD_SLOTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Trash2, UploadCloud, X, ImageIcon, Video } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AssetManager() {
  const { assets, setAsset, clearAsset, isUploading } = useAssets();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "logo" | "hero" | "expertise" | "case" | "client">("all");

  const filtered = UPLOAD_SLOTS.filter((s) => filter === "all" || s.group === filter);
  const filledCount = Object.keys(assets).length;

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="cta"
        className="fixed bottom-5 right-5 z-[150] flex items-center gap-2 rounded-full border border-white/10 bg-ink-100/90 px-4 py-2.5 text-xs font-mono uppercase tracking-[0.18em] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-electric/60 hover:text-electric hover:shadow-glow-md"
      >
        <UploadCloud className="h-4 w-4" />
        Assets
        <span className="ml-1 rounded-full bg-electric/20 px-2 py-0.5 text-[9px] text-electric">
          {filledCount}/{UPLOAD_SLOTS.length}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180] flex items-end justify-end p-4 md:p-6"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="relative flex h-full max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-50"
            >
              {/* Header */}
              <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="eyebrow mb-1">Asset Manager</p>
                  <h2 className="font-display text-2xl tracking-tightest text-bone">
                    Upload your brand assets
                  </h2>
                  <p className="mt-1 text-sm text-mute">
                    Drop in your logo, hero video, bento clips, and case-study reels — they auto-inject site-wide.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
                  aria-label="Close asset manager"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 px-6 py-3 text-xs font-mono uppercase tracking-[0.16em]">
                {(["all", "logo", "hero", "expertise", "case", "client"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 transition",
                      filter === f
                        ? "border-electric bg-electric/10 text-electric"
                        : "border-white/10 text-white/50 hover:border-white/30 hover:text-white",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-2.5">
                  {filtered.map((slot) => {
                    const filled = assets[slot.key];
                    const uploading = isUploading === slot.key;
                    return (
                      <div
                        key={slot.key}
                        className="group flex items-center gap-4 rounded-xl border border-white/10 bg-ink-100/60 p-3 transition hover:border-white/20"
                      >
                        {/* Preview */}
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-200">
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
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={filled.url}
                              alt=""
                              className="absolute inset-0 h-full w-full object-contain p-2"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center text-white/20">
                              {slot.accept.includes("video") ? (
                                <Video className="h-4 w-4" />
                              ) : (
                                <ImageIcon className="h-4 w-4" />
                              )}
                            </div>
                          )}
                          {filled && (
                            <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-electric">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </span>
                          )}
                        </div>

                        {/* Meta */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-bone">{slot.label}</p>
                            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white/40">
                              {slot.group}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-mute">{slot.description}</p>
                          <p className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.16em] text-white/30">
                            {slot.recommended}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <label
                            className={cn(
                              "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-mono uppercase tracking-[0.16em] transition",
                              filled
                                ? "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                                : "border-electric/40 text-electric hover:border-electric hover:bg-electric/10",
                            )}
                          >
                            {uploading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : filled ? (
                              "Replace"
                            ) : (
                              "Upload"
                            )}
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
                              className="rounded-full border border-white/10 p-1.5 text-white/50 transition hover:border-red-500/40 hover:text-red-400"
                              aria-label="Remove asset"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer note */}
              <footer className="border-t border-white/10 bg-ink-100/40 px-6 py-3 text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
                Files saved to <span className="text-white/70">/public/uploads</span> — referenced from{" "}
                <span className="text-white/70">/uploads/[slot].[ext]</span>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
