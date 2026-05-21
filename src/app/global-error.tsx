"use client";

import { useEffect } from "react";

/**
 * Last-resort error boundary.
 *
 * Next.js mounts this when something throws inside the root layout itself
 * (so /app/error.tsx can't render — its parent is broken). This file MUST
 * include <html> and <body> because there's no surviving outer markup.
 *
 * Keep it dependency-free — no providers, no fonts, no Tailwind classes
 * that depend on a build step that may have failed. Inline styles only,
 * so it works even if the CSS bundle is broken.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Even the reporter import could fail if the bundle is corrupt, so
    // log raw here. Cheap and reliable.
    try {
      console.error(
        "[global-error]",
        JSON.stringify({
          message: error?.message,
          stack: error?.stack,
          digest: error?.digest ?? null,
          ts: new Date().toISOString(),
        }),
      );
    } catch {
      /* nothing */
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#020410",
          color: "#fafafa",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            padding: 32,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#0052ff",
              margin: 0,
            }}
          >
            / Critical error
          </p>
          <h1
            style={{
              fontSize: 28,
              letterSpacing: "-0.02em",
              margin: "12px 0 8px",
            }}
          >
            Something went badly wrong.
          </h1>
          <p style={{ color: "#8e8e93", fontSize: 14, lineHeight: 1.5 }}>
            The site couldn&apos;t recover this page. Try refreshing — or
            email us at{" "}
            <a
              href="mailto:caleb@weblogic.digital"
              style={{ color: "#0052ff" }}
            >
              caleb@weblogic.digital
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                reset();
              } catch {
                if (typeof window !== "undefined") window.location.reload();
              }
            }}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              background: "#0052ff",
              color: "#020410",
              border: "none",
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
