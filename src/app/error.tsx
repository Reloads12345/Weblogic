"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import { BRAND } from "@/lib/data";
import { reportError } from "@/lib/error-reporter";

/**
 * Public-site route-segment error boundary.
 *
 * Catches any client-side exception on the public marketing routes (/,
 * /work, /insights, /connect, /pricing, etc.) and shows a branded panel
 * instead of the generic Next.js white screen.
 *
 * Note: admin routes have their own boundary at /app/admin/error.tsx
 * because the failure-mode framing there is different (operator console
 * crashed vs. public visitor saw a broken page).
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, {
      route: "public-route-boundary",
      tags: { digest: error.digest ?? null },
    });
  }, [error]);

  return (
    <main id="main" className="grid min-h-screen place-items-center bg-ink-0 px-6 text-bone">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink-50 p-8 text-center md:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-electric/40 bg-electric/10 text-electric">
          <AlertTriangle className="h-7 w-7" />
        </span>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
          / Something broke
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tightest text-bone md:text-4xl">
          This page didn&apos;t load cleanly.
        </h1>
        <p className="mt-3 text-sm text-mute md:text-base">
          We&apos;ve already been notified. Try refreshing — if it keeps
          happening, email us and we&apos;ll fix it the same day.
        </p>

        {error.digest && (
          <p className="mt-4 inline-block rounded-full border border-white/10 bg-ink-0 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Ref · {error.digest}
          </p>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                reset();
              } catch {
                if (typeof window !== "undefined") window.location.reload();
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-xs font-medium text-ink-0 transition hover:translate-y-[-1px] hover:shadow-glow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs text-bone transition hover:border-white/35"
          >
            <Home className="h-3.5 w-3.5" /> Back to home
          </Link>
          <a
            href={`mailto:${BRAND.email}?subject=Site%20error%20${encodeURIComponent(error.digest ?? "")}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs text-bone transition hover:border-white/35"
          >
            <Mail className="h-3.5 w-3.5" /> Email us
          </a>
        </div>
      </div>
    </main>
  );
}
