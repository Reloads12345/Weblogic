import { NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for the 50% deposit on a WebLogic build.
 * If `STRIPE_SECRET_KEY` is unset (local dev, preview deploys without keys),
 * gracefully falls back to a "simulated" response that still routes the user
 * to /thank-you with the right URL params — so the entire checkout flow can
 * be demoed end-to-end without a Stripe account.
 *
 * Request body (Zod-validated):
 *  - tierId        — "starter" | "growth" | "business"
 *  - tierName      — human label, used as the line item description
 *  - subtotal      — total in USD (number, integer dollars)
 *  - deposit       — 50% of subtotal in USD (integer dollars)
 *  - addons        — array of addon ids
 *  - contact       — { name, email, company?, notes? }
 *
 * Response:
 *  - { redirectUrl: string, placeholder?: boolean }
 *
 * The client just sets `window.location.href = redirectUrl` regardless of
 * which mode we're in — Stripe-hosted or simulated.
 */

const BodySchema = z.object({
  tierId: z.enum(["starter", "growth", "business"]),
  tierName: z.string().min(1).max(80),
  subtotal: z.number().int().min(1).max(100_000),
  deposit: z.number().int().min(1).max(100_000),
  addons: z.array(z.string().min(1).max(40)).max(20),
  contact: z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(200),
    company: z.string().max(200).optional(),
    notes: z.string().max(2000).optional(),
  }),
});

export async function POST(req: Request) {
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

  const { tierId, tierName, subtotal, deposit, addons, contact } = parsed.data;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // ─── No Stripe key? Simulated flow. ───────────────────────────────────────
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    const redirect = new URL("/thank-you", siteUrl);
    redirect.searchParams.set("from", "checkout");
    redirect.searchParams.set("plan", tierId);
    redirect.searchParams.set("total", String(subtotal));
    redirect.searchParams.set("deposit", String(deposit));
    return NextResponse.json({
      redirectUrl: redirect.toString(),
      placeholder: true,
    });
  }

  // ─── Real Stripe flow. ────────────────────────────────────────────────────
  // Dynamic import so the module never ships if the secret key isn't set —
  // keeps cold-start fast on preview deploys.
  const { default: StripeSDK } = await import("stripe");
  const stripe = new StripeSDK(stripeKey, {
    // Pin to a known good API version so behavior is reproducible.
    // The cast lets us pin without coupling to whatever `LatestApiVersion`
    // happens to be in the installed SDK build.
    apiVersion: "2024-09-30.acacia" as Stripe.LatestApiVersion,
    typescript: true,
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "us_bank_account"],
      customer_email: contact.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: deposit * 100, // cents
            product_data: {
              name: `WebLogic — ${tierName} (50% deposit)`,
              description: `Subtotal ${formatUsd(subtotal)} · Deposit ${formatUsd(deposit)} · Balance ${formatUsd(subtotal - deposit)} due at launch`,
            },
          },
        },
      ],
      // All the context we need to reconcile in the dashboard / webhook.
      metadata: {
        tierId,
        tierName,
        subtotal: String(subtotal),
        deposit: String(deposit),
        addons: addons.join(",") || "(none)",
        contactName: contact.name,
        contactCompany: contact.company ?? "",
        contactNotes: contact.notes?.slice(0, 500) ?? "",
      },
      success_url: `${siteUrl}/thank-you?from=stripe&plan=${tierId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?canceled=1&plan=${tierId}`,
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL.");
    }

    return NextResponse.json({ redirectUrl: session.url });
  } catch (err) {
    console.error("[/api/checkout] Stripe error:", err);
    return NextResponse.json(
      { error: "Could not create checkout session. Please try again." },
      { status: 500 },
    );
  }
}

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
