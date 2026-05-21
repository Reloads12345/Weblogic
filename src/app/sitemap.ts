import type { MetadataRoute } from "next";
import { CASE_STUDIES, POSTS, BRAND } from "@/lib/data";

/**
 * Sitemap — Next.js auto-serves this at /sitemap.xml.
 * Update `lastModified` on any URL where content actually changes if you
 * want crawlers to re-index quickly.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/pricing",
    "/checkout",
    "/connect",
    "/thank-you",
    "/press-kit",
    "/privacy",
    "/terms",
    "/security",
    "/accessibility",
    // Service / discipline pages
    "/design",
    "/engineering",
    "/strategy",
    "/seo-aeo",
    "/cro",
    "/ai",
  ];

  return [
    ...staticRoutes.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...CASE_STUDIES.filter((cs) => cs.visible !== false).map((cs) => ({
      url: `${base}/work/${cs.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...POSTS.map((p) => ({
      url: `${base}/insights/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
