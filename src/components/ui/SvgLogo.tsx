import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/data";

interface Props {
  className?: string;
}

/**
 * SvgLogo — pure inline SVG wordmark.
 *   [ WebLogic ]
 *
 * Internal viewBox is 2200×500 so the artwork is high-resolution and stays
 * crisp at any rendered height (header chip, hero band, brand wall).
 * Coloring uses inline rgba so brackets are subtly faded vs the wordmark.
 */
export default function SvgLogo({ className }: Props) {
  return (
    <svg
      viewBox="0 0 2200 500"
      preserveAspectRatio="xMinYMid meet"
      className={cn("h-full w-auto", className)}
      role="img"
      aria-label={BRAND.name}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="395"
        fontFamily='var(--font-display), Inter, "Helvetica Neue", system-ui, sans-serif'
        fontSize="460"
        fontWeight="500"
        letterSpacing="-18"
      >
        <tspan fill="rgba(255,255,255,0.4)" fontWeight="300">
          [
        </tspan>
        <tspan dx="100" fill="rgba(255,255,255,0.96)" fontWeight="500">
          WebLogic
        </tspan>
        <tspan dx="100" fill="rgba(255,255,255,0.4)" fontWeight="300">
          ]
        </tspan>
      </text>
    </svg>
  );
}
