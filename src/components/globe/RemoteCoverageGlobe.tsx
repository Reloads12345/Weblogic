"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * RemoteCoverageGlobe — dark, cinematic Earth-at-night globe with U.S.
 * coverage labels. Sits in the Footer's final-CTA block.
 *
 * Lazy-mounts the Three.js scene via IntersectionObserver + `dynamic({
 * ssr: false })` so Three never ships above-the-fold.
 *
 * Pause control owns the `paused` state and forwards it as a prop to the
 * scene. Reduced-motion forces paused state and disables the button.
 */
const RemoteCoverageScene = dynamic(
  () => import("./RemoteCoverageScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-24 w-24 rounded-full border border-electric/20" />
      </div>
    ),
  },
);

export default function RemoteCoverageGlobe({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const effectivePaused = reducedMotion || paused;

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      aria-label="WebLogic U.S. service coverage globe"
    >
      <div className="relative aspect-square w-full">
        {visible ? (
          <div className="absolute inset-0">
            <RemoteCoverageScene paused={effectivePaused} />
          </div>
        ) : (
          /* Lightweight static placeholder before mount */
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-40 w-40 rounded-full border border-white/8 bg-ink-100/40" />
          </div>
        )}

        {/* Pause / Play button — placed inside the square so it's always
            visible against the globe, with pointer-events:auto so it
            wins clicks against the Canvas underneath. Stops propagation
            explicitly so OrbitControls never swallows the click. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (reducedMotion) return;
            setPaused((p) => !p);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          disabled={reducedMotion}
          aria-label={
            effectivePaused
              ? "Resume globe rotation"
              : "Pause globe rotation"
          }
          className="pointer-events-auto absolute bottom-3 right-3 z-20 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/15 bg-ink-0/70 text-white/75 backdrop-blur-md transition hover:border-electric/60 hover:text-electric disabled:cursor-not-allowed disabled:opacity-40"
        >
          {effectivePaused ? (
            <Play className="h-3.5 w-3.5" />
          ) : (
            <Pause className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Honesty note — sits BELOW the globe square, not overlapping. */}
      <p className="mt-2 px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
        Remote studio · U.S. projects only
      </p>
    </div>
  );
}
