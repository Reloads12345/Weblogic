import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Allowlists exactly the third parties this site actually loads:
 *   • Stripe   — js.stripe.com / api.stripe.com / hooks + checkout (payments)
 *   • Cal.com  — app.cal.com / cal.com (inline booking embed)
 *   • Vercel   — *.vercel-scripts.com (Analytics) + vitals.vercel-insights.com
 *                (Speed Insights beacons); their scripts are same-origin
 *   • Blob     — *.public.blob.vercel-storage.com (admin-uploaded media)
 *   • Unsplash — images.unsplash.com (next/image remote source)
 *
 * `'unsafe-inline'` is required on script-src/style-src because Next.js
 * injects inline bootstrap scripts + a JSON-LD block, and framer-motion
 * writes inline styles — none of which carry a nonce here. Host
 * allowlisting still blocks loading attacker scripts from external
 * origins, and frame-ancestors/object-src/base-uri close the big gaps.
 *
 * `'unsafe-eval'` is added ONLY in dev (React Refresh / HMR needs it);
 * production CSP has no eval.
 *
 * ⚠️ If you add a new third-party embed (YouTube, Calendly, a chat
 * widget, etc.), add its origin to the relevant directive here or the
 * browser will silently block it. Smoke-test checkout + the Cal embed +
 * a work-card video after any change to this policy.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.stripe.com https://app.cal.com https://*.vercel-scripts.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://images.unsplash.com https://*.stripe.com`,
  `media-src 'self' blob: https://*.public.blob.vercel-storage.com`,
  `font-src 'self' data:`,
  `connect-src 'self' https://*.public.blob.vercel-storage.com https://api.stripe.com https://app.cal.com https://*.vercel-scripts.com https://vitals.vercel-insights.com`,
  `frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://app.cal.com https://cal.com`,
  `worker-src 'self' blob:`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self' https://checkout.stripe.com`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin tracing root to the project dir so Next.js doesn't pick up the
  // stray `package-lock.json` one level up in OneDrive.
  outputFileTracingRoot: __dirname,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@react-three/drei"],
  },
  images: {
    // Allow next/image to optimize remote sources we actually use. The Vercel
    // Blob hostname pattern is `<store-id>.public.blob.vercel-storage.com` —
    // the wildcard covers admin-uploaded media + future stores.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.weblogic.example" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // AVIF first, then WebP — modern browsers get the smaller format
    // automatically, Safari falls back to WebP.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS for one year on every subdomain. Safe to add now
          // — the production hostname `weblogic.digital` is already
          // HTTPS-only. If we ever serve over HTTP (e.g. an internal
          // tool), strip this for that hostname.
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Deny everything we don't actively use — camera, mic,
          // geolocation, etc. — to minimize the surface a malicious
          // dependency could exploit at runtime.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(self), interest-cohort=()",
          },
          // Content-Security-Policy — see the `csp` constant above for the
          // full allowlist + maintenance notes.
          { key: "Content-Security-Policy", value: csp },
        ],
      },
      {
        // Most uploads can change (admin re-uploads work projects, etc.) —
        // short cache + stale-while-revalidate so the browser uses the
        // cached copy immediately while checking for an update in the
        // background.
        source: "/uploads/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Static texture assets — never change. Cache hard.
        source: "/textures/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
