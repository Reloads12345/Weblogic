/**
 * TechLogos — inline monochrome SVG marks for the "Built with Modern Architecture"
 * marquee. Every icon uses currentColor so we can theme them all white at once.
 */

interface IconProps {
  className?: string;
}

const base = "fill-current text-bone";

export function NextjsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Next.js">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8.5 7v10M15.5 7l-7 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function VercelIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Vercel">
      <path d="M12 4 L22 20 L2 20 Z" fill="currentColor" />
    </svg>
  );
}

export function TypeScriptIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="TypeScript">
      <rect x="1" y="1" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="currentColor" fontFamily="-apple-system, sans-serif">TS</text>
    </svg>
  );
}

export function TailwindIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 16" className={`${base} ${className ?? ""}`} aria-label="Tailwind CSS">
      <path d="M3 8 C5 3 9 3 11 8 C13 13 17 13 19 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M9 13 C11 8 15 8 17 13 C19 18 23 18 25 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function FramerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Framer Motion">
      <path d="M5 3 H19 V10 H12 V17 L19 17 V10 L5 10 Z" fill="currentColor" />
    </svg>
  );
}

export function GsapIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="GSAP">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 9 a5 5 0 1 0 1 6 H12" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ThreeJsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Three.js">
      <path d="M12 2 L22 19 L2 19 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 2 L12 19 M2 19 L22 19" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function StoryblokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Storyblok">
      <path d="M5 4 h12 a3 3 0 0 1 3 3 v6 a3 3 0 0 1 -3 3 H10 L5 21 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M9 9 h6 M9 12 h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SanityIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Sanity">
      <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M9 9 a3 3 0 0 1 6 0 c0 3 -6 1 -6 4 a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ContentfulIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Contentful">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <circle cx="6.5" cy="15" r="2" fill="currentColor" />
      <circle cx="17.5" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}

export function AemIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Adobe Experience Manager">
      <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 17 L12 7 L16 17 M9.6 14 H14.4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HubSpotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="HubSpot">
      <circle cx="12" cy="15" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="4" r="1.6" fill="currentColor" />
      <path d="M12 10 V5.6 M16.5 13 L20 11.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="20.5" cy="11.2" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function SalesforceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 24" className={`${base} ${className ?? ""}`} aria-label="Salesforce">
      <path
        d="M7 17 a4 4 0 0 1 0.5 -7.9 a5 5 0 0 1 9.5 -1 a4 4 0 0 1 7 3.5 a3.5 3.5 0 0 1 -3 5.4 H7 z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SegmentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Segment">
      <path d="M3 9 H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 15 H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="9" r="1.6" fill="currentColor" />
      <circle cx="4" cy="15" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function GrowthBookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="GrowthBook">
      <path d="M3 19 H21 M3 19 V5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M5 16 L10 11 L13 14 L19 7" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7 H19 V10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AlgoliaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Algolia">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function CloudflareIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 20" className={`${base} ${className ?? ""}`} aria-label="Cloudflare">
      <path
        d="M7 16 a4 4 0 0 1 0.5 -7.9 a5 5 0 0 1 9 0 H22 L20 12 H8"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DatadogIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Datadog">
      <circle cx="7.5" cy="10" r="2" fill="currentColor" />
      <circle cx="13" cy="7" r="2" fill="currentColor" />
      <circle cx="18" cy="11" r="2" fill="currentColor" />
      <circle cx="6" cy="15" r="2" fill="currentColor" />
      <path d="M8 19 a5 5 0 0 1 9 -2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ZodIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-label="Zod">
      <path d="M5 5 H19 L5 19 H19" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LenisIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 14" className={`${base} ${className ?? ""}`} aria-label="Lenis">
      <path d="M2 7 C5 1 9 13 14 7 C19 1 23 13 26 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Curated tech-stack list with icon + label.
 * Used in TechStack.tsx marquee.
 */
export const TECH_LOGOS = [
  { name: "Next.js 15", Component: NextjsIcon },
  { name: "Vercel", Component: VercelIcon },
  { name: "TypeScript", Component: TypeScriptIcon },
  { name: "Tailwind", Component: TailwindIcon },
  { name: "Framer Motion", Component: FramerIcon },
  { name: "GSAP", Component: GsapIcon },
  { name: "Three.js", Component: ThreeJsIcon },
  { name: "Storyblok", Component: StoryblokIcon },
  { name: "Sanity", Component: SanityIcon },
  { name: "Contentful", Component: ContentfulIcon },
  { name: "Adobe Experience Manager", Component: AemIcon },
  { name: "HubSpot", Component: HubSpotIcon },
  { name: "Salesforce", Component: SalesforceIcon },
  { name: "Segment", Component: SegmentIcon },
  { name: "GrowthBook", Component: GrowthBookIcon },
  { name: "Algolia", Component: AlgoliaIcon },
  { name: "Cloudflare", Component: CloudflareIcon },
  { name: "Datadog", Component: DatadogIcon },
  { name: "Zod", Component: ZodIcon },
  { name: "Lenis", Component: LenisIcon },
];
