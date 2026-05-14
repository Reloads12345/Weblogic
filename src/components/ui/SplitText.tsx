"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  as?: ElementType;
  text: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Threshold for IntersectionObserver */
  threshold?: number;
  highlight?: { word: string; node: ReactNode } | null;
}

/**
 * Lightweight split-text reveal — splits by words into masked lines,
 * then reveals on intersection with optional staggered delay.
 *
 * Used for the hero "Composable websites that never stand still."
 */
export default function SplitText({
  as: Tag = "h1",
  text,
  className,
  lineClassName,
  delay = 0,
  stagger = 60,
  threshold = 0.3,
  highlight = null,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lines = el.querySelectorAll<HTMLElement>("[data-line]");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          lines.forEach((line, i) => {
            window.setTimeout(() => {
              line.classList.add("is-in");
            }, delay + i * stagger);
          });
          io.disconnect();
        });
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, stagger, threshold]);

  // Naive line breaking: split by sentence punctuation + commas + " — "
  const segments = text
    .split(/(\.\s|—\s|\?\s|!\s)/)
    .filter(Boolean)
    .reduce<string[]>((acc, cur) => {
      if (acc.length === 0) return [cur];
      const last = acc[acc.length - 1];
      if (cur.match(/^[.!?—]/)) {
        acc[acc.length - 1] = last + cur;
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);

  // React 19's ElementType has narrow children typings — use createElement to bypass.
  return createElement(
    Tag,
    { ref, className: cn(className) },
    segments.map((seg, i) => {
      if (highlight && seg.includes(highlight.word)) {
        const parts = seg.split(highlight.word);
        return (
          <span key={i} data-line className={cn("reveal-line", lineClassName)}>
            <span>
              {parts[0]}
              {highlight.node}
              {parts[1]}
            </span>
          </span>
        );
      }
      return (
        <span key={i} data-line className={cn("reveal-line", lineClassName)}>
          <span>{seg}</span>
        </span>
      );
    }),
  );
}
