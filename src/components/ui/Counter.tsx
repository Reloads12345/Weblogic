"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber, easeOutExpo } from "@/lib/utils";

interface Props {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function Counter({
  value,
  decimals = 0,
  prefix,
  suffix,
  duration = 1800,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    let started = false;

    const animate = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = easeOutExpo(p);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            raf = requestAnimationFrame(animate);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(display, decimals)}
      {suffix}
    </span>
  );
}
