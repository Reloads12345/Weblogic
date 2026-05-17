import { Github, Instagram, Linkedin } from "lucide-react";
import type { SocialLink } from "@/lib/data";

/**
 * SocialIcon — renders the right glyph for a given SocialLink key.
 *
 * GitHub / LinkedIn / Instagram come from `lucide-react` (already a
 * dependency). X and TikTok aren't in lucide so they're inlined as SVG
 * paths — same stroke weight and visual style so the row reads as one set.
 */
export default function SocialIcon({
  social,
  className,
}: {
  social: SocialLink;
  className?: string;
}) {
  switch (social.key) {
    case "github":
      return <Github className={className} aria-hidden />;
    case "linkedin":
      return <Linkedin className={className} aria-hidden />;
    case "instagram":
      return <Instagram className={className} aria-hidden />;
    case "x":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.831l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.5a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.93Z" />
        </svg>
      );
  }
}
