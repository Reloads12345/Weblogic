"use client";

import { useEffect } from "react";

/**
 * SmoothScrollProvider — Lenis wheel-smoothing on desktop only.
 *
 * Why dynamic import + multi-gate:
 *   • Lenis is ~14kb gzipped and we don't want mobile bundles paying for
 *     code that's never executed there. The dynamic `import("lenis")` is
 *     lazy-resolved inside `useEffect`, so it's stripped from the
 *     mobile-served JS payload entirely.
 *   • Three independent gates — `prefers-reduced-motion`, touch-only
 *     pointer, and a 768px width check — ensure phones, tablets, and
 *     accessibility users always get native scrolling. Native iOS / Android
 *     scrolling is faster and more battery-efficient than rAF-driven
 *     lerping anyway.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    const isNarrow = window.innerWidth < 768;
    if (reduced || isTouch || isNarrow) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    // Dynamic import so Lenis JS is split into its own chunk and never
    // shipped to mobile/touch/reduced-motion users at all.
    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;

        const lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          lerp: 0.09,
        });

        let frame = 0;
        function raf(time: number) {
          lenis.raf(time);
          frame = requestAnimationFrame(raf);
        }
        frame = requestAnimationFrame(raf);

        document.documentElement.classList.add("lenis-active");

        cleanup = () => {
          cancelAnimationFrame(frame);
          lenis.destroy();
          document.documentElement.classList.remove("lenis-active");
        };
      })
      .catch((err) => {
        console.warn("[smooth-scroll] lenis_failed", err);
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
