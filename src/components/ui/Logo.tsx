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
 *
 * Hard ceiling: NEVER bigger than ~180px wide on desktop. The wordmark
 * PNG has a wide aspect ratio (~5:1), so even modest height values
 * create wide elements. Anything larger than h-10 visibly competes with
 * the nav and breaks the header. Locked here intentionally.
 */
const heightClass = {
  sm: "h-6 w-auto max-w-[88px]",
  // Header default. Mobile stays compact (so the wordmark never breaks the
  // flex row on a phone), then expands ~+200px at md and ~+400px at lg.
  //   mobile: ~140px wide
  //   md:    ~352px wide  (h-20 × 4.4 wordmark aspect)
  //   lg:    ~560px wide  (h-32 × 4.4, capped by max-w)
  // The lg height (128px) extends below the 88px header bar — overflow
  // lands in the section's pt-40 padding, so no content is covered.
  md: "h-10 w-auto max-w-[200px] md:h-20 md:max-w-[360px] lg:h-32 lg:max-w-[560px]",
  lg: "h-10 w-auto max-w-[200px] md:h-20 md:max-w-[360px] lg:h-32 lg:max-w-[560px]",
  // Footer wordmark — a touch bigger than the slimmest size
  xl: "h-10 w-auto max-w-[180px] md:h-12 md:max-w-[220px]",
  // Reserved for the rare full-bleed brand visual on /about / discipline pages
  huge: "h-14 w-auto max-w-[280px] md:h-20 md:max-w-[400px] lg:h-24 lg:max-w-[480px]",
} as const;

/**
 * Static path to the WebLogic wordmark. Served from /public/brand/ which
 * is committed to Git (unlike /public/uploads/, which is gitignored and
 * therefore missing on every Vercel deploy — that was the source of the
 * giant "[WebLogic]" flash on production).
 *
 * If the file is somehow missing the `onError` handler swaps to the
 * inline SvgLogo, so the header is never blank.
 */
const LOGO_SRC = "/brand/logo.png";

export default function Logo({ className, size = "md" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // SVG fallback is intentionally capped to a small footprint regardless
    // of the requested size — so a 404 on the PNG never blows out the
    // header with a giant "[WebLogic]" placeholder.
    return (
      <span
        className={cn(
          "inline-flex items-center h-8 w-auto max-w-[140px] md:h-10 md:max-w-[160px]",
          className,
        )}
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
