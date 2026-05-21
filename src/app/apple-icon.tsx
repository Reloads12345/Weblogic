import { ImageResponse } from "next/og";

/**
 * Apple touch icon — 180×180 PNG.
 *
 * iOS Safari does NOT reliably accept SVG apple-touch-icons (older Safari
 * silently falls back to a 152×152 generic). Next.js auto-routes this
 * file at `/apple-icon` and injects the proper
 *   <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon">
 * tag — overriding the SVG fallback declared in app/layout.tsx for any
 * device that asks for an Apple icon.
 *
 * Design matches `/public/icons/favicon.svg`: dark navy rounded square,
 * dual-tone electric-blue brackets, faint `</>` mark. Rendered server-side
 * on the edge — no client weight, no PNG asset to commit.
 */
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#020410",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          // iOS rounds the corners itself, but rounding here too means the
          // icon looks correct on Android home screens, PWA installs, and
          // any device that doesn't auto-mask.
          borderRadius: 40,
        }}
      >
        {/* Centered [ </> ] glyph block, scaled to fill ~70% of the canvas */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "#1d6efb",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            fontWeight: 700,
            fontSize: 86,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          <span>[</span>
          <span style={{ color: "#3b8bff", fontSize: 60 }}>&lt;/&gt;</span>
          <span style={{ color: "#4d96ff" }}>]</span>
        </div>

        {/* Subtle bottom-right glow — sells the "premium app icon" feel */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 120,
            height: 120,
            background:
              "radial-gradient(60% 60% at 80% 80%, rgba(0,82,255,0.30), rgba(0,82,255,0) 70%)",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
