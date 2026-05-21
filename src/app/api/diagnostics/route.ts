import { NextResponse } from "next/server";
import { errorReporterBackend } from "@/lib/error-reporter";
import { checkAdmin } from "@/lib/admin-session";

/**
 * GET /api/diagnostics
 *
 * Boolean-only snapshot of which env vars the production server can see,
 * plus a focused env-key scanner under `envDebug` for diagnosing the
 * "I added it in Vercel but the server doesn't see it" scenario.
 *
 * SAFETY:
 *   - Never returns secret VALUES.
 *   - Returns variable NAMES + booleans only.
 *   - Public-safe to expose at /api/diagnostics.
 *
 * Use `envDebug.matchingKeys` to confirm exactly which env-var names the
 * deployed Node process can see. If a name you expect (e.g.
 * `BLOB_READ_WRITE_TOKEN`) isn't in that list, it means Vercel did not
 * pass it to this deployment — usually because:
 *   1. The var was added but not to the Production scope.
 *   2. The var was added with a typo / hidden whitespace / surrounding
 *      quotes in Vercel's UI.
 *   3. The deployment was built before the var was added (Vercel snapshots
 *      env vars at build time — a redeploy is required after changes).
 */

// Run in Node so we get the full env. Force dynamic + zero revalidation
// so the response is never cached — every hit reads the live env.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function GET(req: Request) {
  // Gate this endpoint — it inventories env-var names, deployment SHA,
  // and infra topology. Useful for the operator, dangerous if any of
  // that info shapes a future attack. `checkAdmin` returns null when
  // the `x-admin-token` header matches ADMIN_PASSWORD; otherwise 401.
  const unauthorized = checkAdmin(req);
  if (unauthorized) {
    return NextResponse.json(unauthorized.body, { status: unauthorized.status });
  }

  const stripePrices: Record<string, boolean> = {};
  for (const k of STRIPE_PRICE_KEYS) {
    stripePrices[k] = Boolean(process.env[k]);
  }
  const missingStripePrices = STRIPE_PRICE_KEYS.filter(
    (k) => !process.env[k],
  );

  // ──────────────────────── envDebug ────────────────────────
  // Returns ONLY env-var names + booleans. Never the values.
  const allKeys = Object.keys(process.env);
  const matchingKeys = allKeys
    .filter(
      (key) =>
        key.includes("STRIPE") ||
        key.includes("RESEND") ||
        key.includes("BLOB") ||
        key.includes("SUPPORT") ||
        key.includes("CONTACT") ||
        key.includes("LEAD") ||
        key.includes("NEXT_PUBLIC"),
    )
    .sort();

  const exactChecks = {
    RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
    BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    SUPPORT_EMAIL: Boolean(process.env.SUPPORT_EMAIL),
    NEXT_PUBLIC_CONTACT_EMAIL: Boolean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    LEAD_FROM_EMAIL: Boolean(process.env.LEAD_FROM_EMAIL),
    LEAD_TO_EMAIL: Boolean(process.env.LEAD_TO_EMAIL),
    STRIPE_SECRET_KEY: Boolean(process.env.STRIPE_SECRET_KEY),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Boolean(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    ),
    STRIPE_PRICE_STARTER_DEPOSIT: Boolean(
      process.env.STRIPE_PRICE_STARTER_DEPOSIT,
    ),
    STRIPE_PRICE_GROWTH_DEPOSIT: Boolean(
      process.env.STRIPE_PRICE_GROWTH_DEPOSIT,
    ),
    STRIPE_PRICE_BUSINESS_SYSTEM_DEPOSIT: Boolean(
      process.env.STRIPE_PRICE_BUSINESS_SYSTEM_DEPOSIT,
    ),
    STRIPE_PRICE_CUSTOM_PROJECT_DEPOSIT: Boolean(
      process.env.STRIPE_PRICE_CUSTOM_PROJECT_DEPOSIT,
    ),
    STRIPE_PRICE_WEBSITE_AUDIT: Boolean(process.env.STRIPE_PRICE_WEBSITE_AUDIT),
    STRIPE_PRICE_ADDON_EXTRA_PAGE: Boolean(
      process.env.STRIPE_PRICE_ADDON_EXTRA_PAGE,
    ),
    STRIPE_PRICE_ADDON_ADVANCED_SEO: Boolean(
      process.env.STRIPE_PRICE_ADDON_ADVANCED_SEO,
    ),
    STRIPE_PRICE_ADDON_BLOG_CMS: Boolean(
      process.env.STRIPE_PRICE_ADDON_BLOG_CMS,
    ),
    STRIPE_PRICE_ADDON_BOOKING_SYSTEM: Boolean(
      process.env.STRIPE_PRICE_ADDON_BOOKING_SYSTEM,
    ),
    STRIPE_PRICE_ADDON_STRIPE_CHECKOUT: Boolean(
      process.env.STRIPE_PRICE_ADDON_STRIPE_CHECKOUT,
    ),
    STRIPE_PRICE_ADDON_EMAIL_AUTOMATION: Boolean(
      process.env.STRIPE_PRICE_ADDON_EMAIL_AUTOMATION,
    ),
    STRIPE_PRICE_ADDON_COPYWRITING: Boolean(
      process.env.STRIPE_PRICE_ADDON_COPYWRITING,
    ),
    STRIPE_PRICE_ADDON_SPEED_OPTIMIZATION: Boolean(
      process.env.STRIPE_PRICE_ADDON_SPEED_OPTIMIZATION,
    ),
    STRIPE_PRICE_ADDON_MOTION_ANIMATION: Boolean(
      process.env.STRIPE_PRICE_ADDON_MOTION_ANIMATION,
    ),
    STRIPE_PRICE_ADDON_PRIORITY_DELIVERY: Boolean(
      process.env.STRIPE_PRICE_ADDON_PRIORITY_DELIVERY,
    ),
    STRIPE_PRICE_WEBSITE_CARE_ESSENTIAL: Boolean(
      process.env.STRIPE_PRICE_WEBSITE_CARE_ESSENTIAL,
    ),
    STRIPE_PRICE_WEBSITE_CARE_GROWTH: Boolean(
      process.env.STRIPE_PRICE_WEBSITE_CARE_GROWTH,
    ),
    STRIPE_PRICE_WEBSITE_CARE_SYSTEMS: Boolean(
      process.env.STRIPE_PRICE_WEBSITE_CARE_SYSTEMS,
    ),
    STRIPE_PRICE_CUSTOM_RETAINER: Boolean(
      process.env.STRIPE_PRICE_CUSTOM_RETAINER,
    ),
  };

  return NextResponse.json({
    buildTime: new Date().toISOString(),
    deployment: {
      onVercel: process.env.VERCEL === "1",
      vercelEnv: process.env.VERCEL_ENV ?? null,
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      gitBranch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      nodeEnv: process.env.NODE_ENV ?? null,
      buildTime: new Date().toISOString(),
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
    monitoring: {
      // "sentry" once SENTRY_DSN is set; "console" today.
      backend: errorReporterBackend(),
      hasSentryDsn: Boolean(
        process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
      ),
    },

    // ─────────────── ENV SCANNER ───────────────
    // Names + booleans only. Use this to verify what the deployed Node
    // process can actually see — disagreement with the Vercel dashboard
    // means a typo, wrong scope, or a stale deploy.
    envDebug: {
      totalEnvKeys: allKeys.length,
      matchingKeys,
      exactChecks,
    },
  });
}
