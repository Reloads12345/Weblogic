import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/data";

/**
 * Programmatic Open Graph image — Next renders this on the edge and
 * serves it at /opengraph-image (also reachable as the og:image of the
 * root layout). LinkedIn / X / Slack / Discord all auto-discover it.
 *
 * No external image file needed; ships zero KB to the client. Edit the
 * JSX below and the OG preview updates on next deploy.
 */
export const runtime = "edge";
export const alt = `${BRAND.name} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Electric-blue corner bracket — brand mark in lieu of logo file */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 22,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontFamily: "monospace",
            color: "#0052ff",
          }}
        >
          <span>[ &lt;/&gt; ]</span>
          <span>{BRAND.name.toUpperCase()}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              fontWeight: 600,
              maxWidth: 1000,
            }}
          >
            Websites &amp; systems that
            <br />
            <span style={{ color: "#8e8e93" }}>
              evolve with your business.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#8e8e93",
              maxWidth: 920,
              lineHeight: 1.35,
            }}
          >
            High-performance websites, client portals, payment systems, and
            automations for U.S. businesses.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#8e8e93",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span>{BRAND.domain}</span>
          <span style={{ color: "#0052ff" }}>● Book a free audit</span>
        </div>

        {/* Bottom-right electric corner highlight */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 360,
            height: 360,
            background:
              "radial-gradient(60% 60% at 80% 80%, rgba(0,82,255,0.35), rgba(0,82,255,0) 70%)",
          }}
        />
      </div>
    ),
    size,
  );
}
