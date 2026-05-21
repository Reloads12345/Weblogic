import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
