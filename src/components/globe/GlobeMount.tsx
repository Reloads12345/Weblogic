"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ComposableUniverse = dynamic(() => import("./ComposableUniverse"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative">
        <div className="h-32 w-32 rounded-full border border-electric/20" />
        <div className="absolute inset-0 animate-rotate-slow rounded-full border border-electric/40 border-t-electric" />
      </div>
    </div>
  ),
});

/**
 * GlobeMount — lazy IntersectionObserver wrapper.
 * Three.js scene only mounts when the container is within 400px of the viewport.
 * Saves an enormous amount of CPU + JS init on pages with multiple globes.
 */
export default function GlobeMount({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "footer";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If IO unsupported, just mount immediately.
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

  return (
    <div ref={ref} className={cn("relative", className)}>
      {visible && <ComposableUniverse variant={variant} className="absolute inset-0" />}
    </div>
  );
}
