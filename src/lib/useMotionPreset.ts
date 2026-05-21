"use client";

import { useEffect, useState } from "react";

/**
 * useMotionPreset
 *
 * Returns animation tuning that downgrades automatically on small / low-
 * power devices. Framer Motion's `whileInView` defaults animate large
 * distances over 0.7–0.9s, which feels luxurious on a Mac but jitters on
 * mid-range Android phones — especially when 4+ sections enter the
 * viewport in quick succession during a scroll.
 *
 * Usage:
 *   const m = useMotionPreset();
 *   <motion.div
 *     initial={{ opacity: 0, y: m.distance }}
 *     whileInView={{ opacity: 1, y: 0 }}
 *     viewport={{ once: true, margin: m.viewportMargin }}
 *     transition={{ duration: m.duration, ease: m.ease }}
 *   />
 */
export interface MotionPreset {
  duration: number;
  delayStep: number;
  distance: number;
  ease: [number, number, number, number];
  viewportMargin: string;
  reduce: boolean;
}

const DESKTOP: MotionPreset = {
  duration: 0.7,
  delayStep: 0.06,
  distance: 22,
  ease: [0.16, 1, 0.3, 1],
  viewportMargin: "-60px",
  reduce: false,
};

const MOBILE: MotionPreset = {
  duration: 0.35,
  delayStep: 0.025,
  distance: 10,
  ease: [0.16, 1, 0.3, 1],
  viewportMargin: "-20px",
  reduce: true,
};

const REDUCED: MotionPreset = {
  duration: 0.001,
  delayStep: 0,
  distance: 0,
  ease: [0, 0, 1, 1],
  viewportMargin: "0px",
  reduce: true,
};

export function useMotionPreset(): MotionPreset {
  const [preset, setPreset] = useState<MotionPreset>(DESKTOP);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const update = () => {
      if (reducedQuery.matches) {
        setPreset(REDUCED);
      } else if (mobileQuery.matches) {
        setPreset(MOBILE);
      } else {
        setPreset(DESKTOP);
      }
    };

    update();
    reducedQuery.addEventListener("change", update);
    mobileQuery.addEventListener("change", update);
    return () => {
      reducedQuery.removeEventListener("change", update);
      mobileQuery.removeEventListener("change", update);
    };
  }, []);

  return preset;
}
