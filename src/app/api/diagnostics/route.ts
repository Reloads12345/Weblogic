import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/diagnostics
 *
 * Returns a boolean-only snapshot of which env vars are configured + which
 * deployment is being served. **Never returns secret values.** Safe to
 * leave publicly accessible.
 *
 * Use this to confirm Vercel actually picked up env vars + redeployed:
 *
 *   curl https://weblogic.digital/api/diagnostics | jq
 *
 * Each field is either `true / false` or a small piece of metadata that
 * doesn't reveal credentials (e.g. the domain portion of LEAD_FROM_EMAIL).
 */

function parseFromDomain(raw: string | undefined): string | null {
  if (!raw) return null;
  const match = raw.match(/@([\w.-]+\.[A-Za-z]{2,})/);
  return match?.[1] ?? null;
}

const STRIPE_PRICE_KEYS = [
  "STRIPE_PRICE_STARTER_DEPOSIT",
  "STRIPE_PRICE_GROWTH_DEPOSIT",
  "STRIPE_PRICE_BUSINESS_SYSTEM_DEPOSIT",
  "STRIPE_PRICE_CUSTOM_PROJECT_DEPOSIT",
  "STRIPE_PRICE_WEBSITE_AUDIT",
  "STRIPE_PRICE_ADDON_EXTRA_PAGE",
  "STRIPE_PRICE_ADDON_ADVANCED_SEO",
  "STRIPE_PRICE_ADDON_BLOG_CMS",
  "STRIPE_PRICE_ADDON_BOOKING_SYSTEM",
  "STRIPE_PRICE_ADDON_STRIPE_CHECKOUT",
  "STRIPE_PRICE_ADDON_EMAIL_AUTOMATION",
  "STRIPE_PRICE_ADDON_COPYWRITING",
  "STRIPE_PRICE_ADDON_SPEED_OPTIMIZATION",
  "STRIPE_PRICE_ADDON_MOTION_ANIMATION",
  "STRIPE_PRICE_ADDON_PRIORITY_DELIVERY",
  "STRIPE_PRICE_WEBSITE_CARE_ESSENTIAL",
  "STRIPE_PRICE_WEBSITE_CARE_GROWTH",
  "STRIPE_PRICE_WEBSITE_CARE_SYSTEMS",
  "STRIPE_PRICE_CUSTOM_RETAINER",
] as const;

export async function GET() {
  const stripePrices: Record<string, boolean> = {};
  for (const k of STRIPE_PRICE_KEYS) {
    stripePrices[k] = Boolean(process.env[k]);
  }
  const missingStripePrices = STRIPE_PRICE_KEYS.filter(
    (k) => !process.env[k],
  );

  return NextResponse.json({
    buildTime: new Date().toISOString(),
    deployment: {
      onVercel: process.env.VERCEL === "1",
      vercelEnv: process.env.VERCEL_ENV ?? null,
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      gitBranch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      nodeEnv: process.env.NODE_ENV ?? null,
    },
    site: {
      hasNextPublicSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
      hasContactEmail: Boolean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
      hasSupportEmail: Boolean(process.env.SUPPORT_EMAIL),
    },
    resend: {
      hasApiKey: Boolean(process.env.RESEND_API_KEY),
      hasFromEmail: Boolean(process.env.LEAD_FROM_EMAIL),
      hasToEmail: Boolean(process.env.LEAD_TO_EMAIL),
      fromDomain: parseFromDomain(process.env.LEAD_FROM_EMAIL),
      expectedDomain: "weblogic.digital",
      domainMatches:
        parseFromDomain(process.env.LEAD_FROM_EMAIL) === "weblogic.digital",
    },
    stripe: {
      hasSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
      hasPublishableKey: Boolean(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      ),
      hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      stripeKeyMode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")
        ? "live"
        : process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")
          ? "test"
          : "unset",
      pricesConfigured: STRIPE_PRICE_KEYS.length - missingStripePrices.length,
      pricesTotal: STRIPE_PRICE_KEYS.length,
      missingPrices: missingStripePrices,
    },
    admin: {
      hasUsername: Boolean(process.env.ADMIN_USERNAME),
      hasPassword: Boolean(process.env.ADMIN_PASSWORD),
    },
    storage: {
      hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      uploadMode:
        process.env.VERCEL === "1"
          ? process.env.BLOB_READ_WRITE_TOKEN
            ? "vercel-blob"
            : "disabled"
          : "filesystem",
    },
  });
}
