import { NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import {
  ADDONS,
  CARE_PLANS,
  CARE_PLAN_KEYS,
  PACKAGES,
  PACKAGE_KEYS,
  ADDON_KEYS,
  addonAllowedForPackage,
  formatUsd,
  type AddonKey,
  type CarePlanKey,
  type PackageKey,
} from "@/lib/checkout-config";
import { reportError } from "@/lib/error-reporter";

/**
 * Lead-capture fallback. Called whenever Stripe can't actually create the
 * session — missing env var, network error, API error, anything. We still
 * have all the contact details, so we email Caleb directly so the lead
 * isn't lost, then redirect the user to a soft thank-you page that says
 * "we got your details, we'll follow up." Better than showing
 * "Checkout temporarily unavailable" and losing a paying customer.
 */
async function captureFallbackLead(opts: {
  reason: string;
  contact: {
    name: string;
    email: string;
    businessName: string;
    currentUrl?: string;
    projectNotes?: string;
    timeline?: string;
    budget?: string;
    bestContactMethod?: string;
  };
  summary: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL ?? "caleb@weblogic.digital";
  const fromEmail =
    process.env.LEAD_FROM_EMAIL ??
    "WebLogic Support <support@weblogic.digital>";

  // Always log — Vercel function logs capture this even if Resend fails.
  console.log(
    "[checkout-fallback] lead captured",
    JSON.stringify({ reason: opts.reason, ...opts.contact, summary: opts.summary }),
  );

  if (!apiKey) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: opts.contact.email,
        subject: `Checkout attempt — follow up needed (${opts.contact.businessName})`,
        text: [
          `WebLogic checkout could not complete a Stripe session.`,
          `Reason: ${opts.reason}`,
          ``,
          `Customer details — follow up via email:`,
          `  Name:      ${opts.contact.name}`,
          `  Email:     ${opts.contact.email}`,
          `  Business:  ${opts.contact.businessName}`,
          `  URL:       ${opts.contact.currentUrl ?? "—"}`,
          `  Timeline:  ${opts.contact.timeline ?? "—"}`,
          `  Budget:    ${opts.contact.budget ?? "—"}`,
          `  Contact:   ${opts.contact.bestContactMethod ?? "—"}`,
          `  Notes:     ${opts.contact.projectNotes ?? "—"}`,
          ``,
          `Order they tried to place:`,
          opts.summary,
        ].join("\n"),
      }),
    });
  } catch (err) {
    console.error("[checkout-fallback] Resend send failed:", err);
  }
}

/**
 * POST /api/checkout
 *
 * Single endpoint that handles both modes:
 *
 *   • Project deposit / one-time purchase  → mode="payment"
 *     line items = [package-deposit price] + [each selected add-on price]
 *
 *   • Monthly care plan                     → mode="subscription"
 *     line item = [care-plan recurring price]
 *
 * Validation is exhaustive and server-side ONLY:
 *   - Stripe Price IDs are resolved at request time from env vars whose
 *     names are stored in /lib/checkout-config.ts. Frontend NEVER sends
 *     a raw Price ID or dollar amount.
 *   - Package keys, add-on keys, and care-plan keys are checked against
 *     the allowlist in checkout-config.
 *   - Add-ons must appear in the selected package's `allowedAddons` list
 *     or the entire request fails 400.
 *   - Required client fields (name, email, businessName) are enforced.
 *
 * Fallback: if STRIPE_SECRET_KEY is unset (e.g. preview deploys without
 * keys), we redirect to /thank-you with the expected URL params so the
 * whole flow can be demoed end-to-end without a Stripe account.
 */

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  businessName: z.string().min(1).max(200),
  currentUrl: z.string().max(300).optional().default(""),
  projectNotes: z.string().max(2000).optional().default(""),
  timeline: z.string().max(80).optional().default(""),
  budget: z.string().max(80).optional().default(""),
  bestContactMethod: z.string().max(60).optional().default(""),
});

const ProjectBodySchema = z.object({
  checkoutType: z.literal("project"),
  packageKey: z.enum(PACKAGE_KEYS as [PackageKey, ...PackageKey[]]),
  addons: z
    .array(z.enum(ADDON_KEYS as [AddonKey, ...AddonKey[]]))
    .max(20)
    .default([]),
  contact: ContactSchema,
});

const SubscriptionBodySchema = z.object({
  checkoutType: z.literal("subscription"),
  carePlanKey: z.enum(CARE_PLAN_KEYS as [CarePlanKey, ...CarePlanKey[]]),
  contact: ContactSchema,
});

const BodySchema = z.discriminatedUnion("checkoutType", [
  ProjectBodySchema,
  SubscriptionBodySchema,
]);

export async function POST(req: Request) {
  /* ─── 1) Parse + validate ─── */
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  /* ─── 2) Build line items + metadata depending on mode ─── */

  let stripeMode: "payment" | "subscription";
  let lineItems: Array<{ price: string; quantity: number }>;
  let successPath: string;
  const metadata: Record<string, string> = {
    source: "WebLogic Checkout",
    customerName: data.contact.name,
    customerEmail: data.contact.email,
    businessName: data.contact.businessName,
  };
  if (data.contact.currentUrl) metadata.currentUrl = data.contact.currentUrl;
  if (data.contact.projectNotes)
    metadata.projectNotes = data.contact.projectNotes.slice(0, 500);
  if (data.contact.timeline) metadata.timeline = data.contact.timeline;
  if (data.contact.budget) metadata.budget = data.contact.budget;
  if (data.contact.bestContactMethod)
    metadata.bestContactMethod = data.contact.bestContactMethod;

  if (data.checkoutType === "project") {
    const pkg = PACKAGES[data.packageKey];
    if (!pkg) {
      return NextResponse.json(
        { error: "Unknown package." },
        { status: 400 },
      );
    }

    // Every add-on must be allowed for this package
    for (const addonKey of data.addons) {
      if (!addonAllowedForPackage(data.packageKey, addonKey)) {
        return NextResponse.json(
          { error: `Add-on "${addonKey}" is not available for ${pkg.name}.` },
          { status: 400 },
        );
      }
    }

    // Resolve Price IDs — if any are missing we fall back to lead capture
    // rather than 500'ing the user.
    const depositPriceId = process.env[pkg.stripePriceEnvKey];
    if (!depositPriceId && stripeKey) {
      console.error(
        `[/api/checkout] Missing env var ${pkg.stripePriceEnvKey} for ${pkg.name}.`,
      );
      await captureFallbackLead({
        reason: `Missing env var ${pkg.stripePriceEnvKey}`,
        contact: data.contact,
        summary: `${pkg.name} — ${formatUsd(pkg.depositUsd)} deposit + ${data.addons.length} add-on(s)`,
      });
      const fallback = new URL(
        `/thank-you?type=lead-checkout-fallback&plan=${pkg.key}`,
        siteUrl,
      );
      return NextResponse.json({ redirectUrl: fallback.toString() });
    }

    const addonLineItems: Array<{ price: string; quantity: number }> = [];
    for (const addonKey of data.addons) {
      const addon = ADDONS[addonKey];
      const priceId = process.env[addon.stripePriceEnvKey];
      if (!priceId && stripeKey) {
        console.error(
          `[/api/checkout] Missing env var ${addon.stripePriceEnvKey} (${addon.name}).`,
        );
        await captureFallbackLead({
          reason: `Missing env var ${addon.stripePriceEnvKey}`,
          contact: data.contact,
          summary: `${pkg.name} + tried to add ${addon.name}`,
        });
        const fallback = new URL(
          `/thank-you?type=lead-checkout-fallback&plan=${pkg.key}`,
          siteUrl,
        );
        return NextResponse.json({ redirectUrl: fallback.toString() });
      }
      if (priceId) addonLineItems.push({ price: priceId, quantity: 1 });
    }

    stripeMode = "payment";
    lineItems = depositPriceId
      ? [{ price: depositPriceId, quantity: 1 }, ...addonLineItems]
      : addonLineItems;

    metadata.packageKey = pkg.key;
    metadata.packageName = pkg.name;
    metadata.selectedAddons =
      data.addons.length > 0 ? data.addons.join(",") : "(none)";

    // type=audit  → Website Audit one-time
    // type=custom → custom project deposit
    // type=project → standard build deposit
    const subType =
      pkg.key === "websiteAudit"
        ? "audit"
        : pkg.key === "customProjectDeposit"
          ? "custom"
          : "project";
    successPath = `/thank-you?type=${subType}&package=${pkg.key}&session_id={CHECKOUT_SESSION_ID}`;
  } else {
    // ─── Subscription / care plan ───
    const plan = CARE_PLANS[data.carePlanKey];
    const priceId = process.env[plan.stripePriceEnvKey];
    if (!priceId && stripeKey) {
      console.error(
        `[/api/checkout] Missing env var ${plan.stripePriceEnvKey} (care plan ${plan.name}).`,
      );
      await captureFallbackLead({
        reason: `Missing env var ${plan.stripePriceEnvKey}`,
        contact: data.contact,
        summary: `${plan.name} subscription — ${formatUsd(plan.monthlyUsd)} / mo`,
      });
      const fallback = new URL(
        `/thank-you?type=lead-checkout-fallback&plan=${plan.key}`,
        siteUrl,
      );
      return NextResponse.json({ redirectUrl: fallback.toString() });
    }

    stripeMode = "subscription";
    lineItems = priceId ? [{ price: priceId, quantity: 1 }] : [];

    metadata.carePlanKey = plan.key;
    metadata.carePlanName = plan.name;

    successPath = `/thank-you?type=subscription&plan=${plan.key}&session_id={CHECKOUT_SESSION_ID}`;
  }

  /* ─── 3) Simulated mode (no Stripe key) — for previews / first deploys ─── */

  if (!stripeKey) {
    const redirect = new URL(successPath.replace("{CHECKOUT_SESSION_ID}", "sim_no_session"), siteUrl);
    return NextResponse.json({
      redirectUrl: redirect.toString(),
      placeholder: true,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "No valid line items resolved." },
      { status: 500 },
    );
  }

  /* ─── 4) Real Stripe call ─── */

  const { default: StripeSDK } = await import("stripe");
  const stripe = new StripeSDK(stripeKey, {
    apiVersion: "2024-09-30.acacia" as Stripe.LatestApiVersion,
    typescript: true,
  });

  try {
    const cancelUrl = new URL("/checkout?canceled=1", siteUrl);
    if (data.checkoutType === "project") {
      cancelUrl.searchParams.set("plan", data.packageKey);
    } else {
      cancelUrl.searchParams.set("carePlan", data.carePlanKey);
    }

    const session = await stripe.checkout.sessions.create({
      mode: stripeMode,
      payment_method_types:
        stripeMode === "subscription" ? ["card"] : ["card", "us_bank_account"],
      customer_email: data.contact.email,
      line_items: lineItems,
      metadata,
      success_url: `${siteUrl}${successPath}`,
      cancel_url: cancelUrl.toString(),
      ...(stripeMode === "subscription"
        ? { subscription_data: { metadata } }
        : { payment_intent_data: { metadata } }),
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL.");
    }
    return NextResponse.json({ redirectUrl: session.url });
  } catch (err) {
    console.error("[/api/checkout] Stripe error:", err);
    reportError(err, {
      route: "/api/checkout",
      tags: { checkoutType: data.checkoutType },
    });
    // Stripe API call failed (auth, network, invalid price, etc.). Capture
    // the lead so Caleb can follow up manually instead of losing it.
    const summary =
      data.checkoutType === "project"
        ? `${PACKAGES[data.packageKey].name} — ${data.addons.length} add-on(s)`
        : `${CARE_PLANS[data.carePlanKey].name} subscription`;
    await captureFallbackLead({
      reason: err instanceof Error ? err.message : "Stripe call failed",
      contact: data.contact,
      summary,
    });
    const fallback = new URL(
      `/thank-you?type=lead-checkout-fallback`,
      siteUrl,
    );
    return NextResponse.json({ redirectUrl: fallback.toString() });
  }
}
