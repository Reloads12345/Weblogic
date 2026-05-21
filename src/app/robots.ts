import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/data";

/**
 * Next auto-serves this at /robots.txt.
 * Disallow /admin (private) and /api (machine endpoints).
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.url;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /portal/<token> is the per-client share URL — never indexable.
        disallow: ["/admin", "/admin/", "/api/", "/portal", "/portal/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
