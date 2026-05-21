import type { Metadata } from "next";
import ConnectClient from "./ConnectClient";

/**
 * /connect — the high-conversion landing page accessed via QR code,
 * direct outreach, or "Free Audit" CTAs. Designed to:
 *
 *   1. Feel premium on first impression
 *   2. Build trust via the founder story + concept redesigns
 *   3. Capture leads through a single inline audit form
 *
 * Public-facing, indexed. ISR cached for 1h.
 */

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Connect with WebLogic — modern websites for businesses that want to grow",
  description:
    "WebLogic builds high-performance websites, branding systems, and digital experiences for businesses that want to stand out and convert better online.",
  alternates: { canonical: "/connect" },
  openGraph: {
    title: "Connect with WebLogic",
    description:
      "Modern websites for businesses that want to grow. Free 24-hour audit.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ConnectPage() {
  return <ConnectClient />;
}
