"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Custom cursor:
 *  - Outer ring (lerps to mouse)
 *  - Inner dot (snaps to mouse)
 *  - Magnetic snap to elements with [data-magnetic]
 *  - Mode 'link' / 'cta' / 'video' from data-cursor=""
 *  - Hidden on touch devices and reduced-motion
 */
export default function MagneticCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);
  const [mode, setMode] = useState<"default" | "link" | "cta" | "video" | "drag">("default");
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const isTouch =
      typeof window === "undefined" ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch) return;

    setHidden(false);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    let raf = 0;
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hover-target detection (event delegation)
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor], [data-magnetic]",
      );
      if (!t) {
        setMode("default");
        setLabel(null);
        return;
      }
      const cursorAttr = t.getAttribute("data-cursor");
      if (cursorAttr === "video") setMode("video");
      else if (cursorAttr === "drag") setMode("drag");
      else if (cursorAttr === "cta" || t.classList.contains("btn-electric")) setMode("cta");
      else setMode("link");

      const labelAttr = t.getAttribute("data-cursor-label");
      setLabel(labelAttr);
    };

    const onLeave = () => {
      setMode("default");
      setLabel(null);
    };

    // Magnetic effect — translate the target slightly toward the cursor
    const onMagneticMove = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const radius = Number(el.getAttribute("data-magnetic-radius") ?? 120);
        if (dist < radius) {
          const strength = Number(el.getAttribute("data-magnetic-strength") ?? 0.35);
          el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
        } else {
          el.style.transform = "translate3d(0,0,0)";
        }
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousemove", onMagneticMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onMagneticMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference",
          "transition-[width,height,border-color,background-color,opacity] duration-300 ease-out-expo",
          mode === "default" && "h-9 w-9 rounded-full border border-white/60",
          mode === "link" && "h-12 w-12 rounded-full border border-white",
          mode === "cta" && "h-16 w-16 rounded-full border-2 border-white",
          mode === "video" && "h-20 w-20 rounded-full bg-white text-ink-0",
          mode === "drag" && "h-20 w-20 rounded-full border-2 border-white",
        )}
      >
        {label && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono uppercase tracking-widest text-white">
            {label}
          </span>
        )}
        {mode === "video" && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.2em] text-ink-0">
            Play
          </span>
        )}
        {mode === "drag" && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.2em] text-white">
            ← Drag →
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[201] h-1.5 w-1.5 rounded-full bg-electric"
        style={{ boxShadow: "0 0 18px rgba(0,82,255,0.85)" }}
      />
    </>
  );
}
