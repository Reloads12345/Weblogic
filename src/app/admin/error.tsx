"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Route-segment error boundary for every page under /admin.
 *
 * When a client-side exception bubbles up inside the admin tree, Next.js
 * mounts this component instead of showing the generic
 * "Application error: a client-side exception has occurred" white screen.
 *
 * The boundary keeps the admin chrome dark + branded, surfaces the actual
 * error message, gives the operator a "Retry" button (calls `reset()`),
 * and a path back to the sign-in screen.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the actual stack to the browser console so we can grep it.
    console.error("[admin-error-boundary]", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-ink-0 px-6 text-bone">
      <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-ink-50 p-8 text-center shadow-glow-md">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-red-500/40 bg-red-500/10 text-red-300">
          <AlertTriangle className="h-7 w-7" />
        </span>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-red-300">
          / Admin error
        </p>
        <h1 className="mt-3 font-display text-2xl tracking-tightest text-bone md:text-3xl">
          The admin console crashed in your browser.
        </h1>
        <p className="mt-3 text-sm text-mute">
          We caught it. Public pages on{" "}
          <span className="text-bone">weblogic.digital</span> are unaffected.
        </p>

        <pre className="mt-5 max-h-40 overflow-auto rounded-xl border border-white/10 bg-ink-0 p-3 text-left font-mono text-[11px] text-red-200/85">
          {error.message || "Unknown error"}
          {error.digest && `\n\nDigest: ${error.digest}`}
        </pre>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                reset();
              } catch {
                // If reset throws (rare), reload the route from scratch.
                if (typeof window !== "undefined") window.location.reload();
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-xs font-medium text-ink-0 transition hover:translate-y-[-1px] hover:shadow-glow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs text-bone transition hover:border-white/35"
          >
            <Home className="h-3.5 w-3.5" /> Back to admin sign-in
          </Link>
        </div>

        <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
          Full stack is in the browser console under [admin-error-boundary]
        </p>
      </div>
    </main>
  );
}
