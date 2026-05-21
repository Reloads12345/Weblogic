import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "We couldn’t find that page. Head back home or get in touch.",
  robots: { index: false, follow: true },
};

/**
 * 404 — branded, with multiple escape hatches.
 *
 * Was a 22-line stub. A polished agency 404 should:
 *   • Restate brand voice so the off-route feels intentional, not broken
 *   • Offer three exits: home, pricing, contact — so anyone landing here
 *     from a stale link can still convert
 *   • Inherit the global header/footer chrome? Intentionally NOT — a 404
 *     embedded in the full site layout invites doom-scrolling. Centered
 *     focus-state with a clear path forward converts better.
 */
export default function NotFound() {
  return (
    <main
      id="main"
      className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-0 px-6 text-center"
    >
      {/* Same electric-glow vignette used on /thank-you so the 404 doesn't
          feel like a dropped-from-a-cliff dead page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(0,82,255,0.18), rgba(0,0,0,0) 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
          / 404 · Page not found
        </p>
        <h1 className="mt-5 text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone md:text-display-xl">
          That page isn&apos;t{" "}
          <span className="text-mute">on the map.</span>
        </h1>
        <p className="mt-6 text-pretty text-mute md:text-lg">
          The URL might be outdated, mistyped, or the page may have moved.
          From here, pick the door that fits — or send us a note and
          we&apos;ll point you at what you were looking for.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-medium text-ink-0 transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,82,255,0.4)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-bone transition hover:border-white/35 hover:bg-white/[0.03]"
          >
            See pricing
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href={`mailto:${BRAND.email}?subject=Broken%20link%20on%20weblogic.digital`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-bone transition hover:border-white/35 hover:bg-white/[0.03]"
          >
            <Mail className="h-4 w-4" />
            Report a broken link
          </a>
        </div>

        <p className="mt-10 text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
          Built remotely · United States
        </p>
      </div>
    </main>
  );
}
