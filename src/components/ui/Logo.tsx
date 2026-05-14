"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/data";
import SvgLogo from "@/components/ui/SvgLogo";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "huge";
}

/**
 * Tailwind sizing for the WebLogic wordmark.
 * Each size locks BOTH a height and a max-width so the SVG/img can't blow
 * out the layout.
 */
const heightClass = {
  sm: "h-6 w-auto max-w-[88px]",
  md: "h-8 w-auto max-w-[140px] md:h-40 md:max-w-[720px] lg:h-44 lg:max-w-[800px]",
  lg: "h-8 w-auto max-w-[140px] md:h-40 md:max-w-[720px] lg:h-44 lg:max-w-[800px]",
  xl: "h-10 w-auto max-w-[200px] md:h-12 md:max-w-[240px]",
  huge: "h-14 w-auto max-w-[280px] md:h-20 md:max-w-[400px] lg:h-24 lg:max-w-[480px]",
} as const;

/**
 * Static path to the uploaded logo. The asset is committed to
 * /public/uploads/ so it ships with every deploy and is fetched in
 * parallel with the HTML — no client-side manifest hydration step, no
 * flash of the SVG fallback before the image swaps in.
 *
 * If the file is missing (rare — only if someone deletes it), the
 * `onError` handler swaps to the inline SvgLogo wordmark, so there's
 * still always *something* in the header.
 */
const LOGO_SRC = "/uploads/logo.png";

export default function Logo({ className, size = "md" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn("inline-flex items-center", heightClass[size], className)}
      >
        <SvgLogo />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt={BRAND.name}
        // Eager loading + high fetch priority — the logo is above-the-fold
        // on every route, so we never want it lazy-loaded.
        loading="eager"
        // @ts-expect-error — `fetchpriority` is valid HTML, types are stale
        fetchpriority="high"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className={cn("object-contain", heightClass[size])}
      />
    </span>
  );
}
