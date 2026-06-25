import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { reportError, reportWarning } from "@/lib/error-reporter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stripe-webhook
 *
 * Receives signed events from Stripe for completed checkouts, failed
 * payments, and subscription state changes.
 *
 * Setup:
 *   1. Stripe Dashboard → Developers → Webhooks → Add endpoint
 *   2. URL: https://weblogic.digital/api/stripe-webhook
 *   3. Events to send (minimum):
 *      - checkout.session.completed
 *      - payment_intent.payment_failed
 *      - customer.subscription.created
 *      - customer.subscription.deleted
 *   4. Copy the signing secret → Vercel env var STRIPE_WEBHOOK_SECRET
 *
 * Security:
 *   - Every request is verified against STRIPE_WEBHOOK_SECRET via
 *     `stripe.webhooks.constructEvent`. Unsigned / replayed requests
 *     are rejected with HTTP 400.
 *   - Without STRIPE_WEBHOOK_SECRET configured, every request is
 *     rejected with HTTP 503 so we never trust unsigned events.
 *
 * Side effects (current):
 *   - Logs the event with `[stripe-webhook] …` tag for Vercel logs
 *   - Sends a confirmation email via Resend on successful checkout
 *
 * Future side effects to wire in here (left as TODOs):
 *   - Append a fulfilment row to a database
 *   - Notify Slack / Discord
 *   - Kick off a project intake form
 */

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!secret || !stripeKey) {
    return NextResponse.json(
      {
        error:
          "Webhook not configured. Set STRIPE_WEBHOOK_SECRET and STRIPE_SECRET_KEY in Vercel.",
      },
      { status: 503 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  // Raw body is required for signature verification — DON'T parse first.
  const rawBody = await req.text();

  const { default: StripeSDK } = await import("stripe");
  const stripe = new StripeSDK(stripeKey, {
    apiVersion: "2024-09-30.acacia" as Stripe.LatestApiVersion,
    typescript: true,
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "signature failed";
    console.error("[stripe-webhook] signature_invalid", message);
    // Signature failures are usually misconfigured webhooks, not attacks —
    // warn-level so they don't pager-alert once real monitoring is wired.
    reportWarning(err, {
      route: "/api/stripe-webhook",
      tags: { reason: "signature_invalid" },
    });
    return NextResponse.json(
      { error: `Webhook signature failed: ${message}` },
      { status: 400 },
    );
  }

  console.log(
    "[stripe-webhook] received",
    JSON.stringify({ type: event.type, id: event.id }),
  );

  // Idempotency guard — Stripe redelivers events on its own retry schedule
  // (and on any 5xx we return). Without a dedup, a redelivered
  // `checkout.session.completed` would send the customer a SECOND
  // confirmation email. We claim a per-event marker before processing; if
  // the marker already exists we ack 200 and do nothing.
  if (await alreadyProcessed(event.id)) {
    console.log("[stripe-webhook] duplicate_skipped", event.id);
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata ?? {};
        const customerEmail =
          session.customer_email ??
          session.customer_details?.email ??
          metadata.customerEmail ??
          null;

        console.log(
          "[stripe-webhook] checkout_completed",
          JSON.stringify({
            id: session.id,
            mode: session.mode,
            amount: session.amount_total,
            currency: session.currency,
            customerEmail,
            packageKey: metadata.packageKey ?? null,
            carePlanKey: metadata.carePlanKey ?? null,
            addons: metadata.selectedAddons ?? null,
          }),
        );

        // Send the customer + the studio a confirmation email.
        await sendCheckoutConfirmation({
          to: customerEmail,
          metadata,
          amount: session.amount_total,
          currency: session.currency ?? "usd",
          sessionId: session.id,
          mode: session.mode,
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn(
          "[stripe-webhook] payment_failed",
          JSON.stringify({
            id: pi.id,
            last_error: pi.last_payment_error?.message ?? null,
            amount: pi.amount,
            metadata: pi.metadata,
          }),
        );
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(
          `[stripe-webhook] ${event.type}`,
          JSON.stringify({
            id: sub.id,
            status: sub.status,
            customer: sub.customer,
            metadata: sub.metadata,
          }),
        );
        break;
      }

      default:
        console.log("[stripe-webhook] unhandled", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe-webhook] handler_error", err);
    reportError(err, {
      route: "/api/stripe-webhook",
      tags: { eventType: event.type, eventId: event.id },
    });
    // Return 500 so Stripe retries — better than silently dropping.
    return NextResponse.json(
      { error: "Handler error, will retry" },
      { status: 500 },
    );
  }
}

/* ─────────────────────── Helpers ─────────────────────── */

/**
 * Idempotency marker via Vercel Blob. Returns true if this event id was
 * already processed (so the caller should no-op), false if this is the
 * first time we've seen it (and claims the marker).
 *
 * Storage: a tiny per-event blob at `stripe-events/<id>.json`. We `head()`
 * to check existence, then `put()` to claim. There's a microscopic race
 * window between head + put if Stripe delivers the same event to two
 * lambdas within milliseconds — acceptable, because the worst case is the
 * pre-existing behavior (one duplicate email), not a payment error.
 *
 * If the Blob token isn't configured (local dev), we fail OPEN — every
 * event is treated as new — because dev rarely sees real duplicate
 * deliveries and we don't want to swallow events while testing.
 */
async function alreadyProcessed(eventId: string): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const safeId = eventId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safeId) return false;
  const key = `stripe-events/${safeId}.json`;
  try {
    const { head, put } = await import("@vercel/blob");
    const existing = await head(key).catch(() => null);
    if (existing) return true;
    await put(key, JSON.stringify({ id: eventId, at: Date.now() }), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return false;
  } catch (err) {
    // On any storage error, fail open (process the event) rather than
    // dropping a potentially important payment event.
    console.warn("[stripe-webhook] idempotency_check_failed", err);
    return false;
  }
}

async function sendCheckoutConfirmation(opts: {
  to: string | null;
  metadata: Record<string, string>;
  amount: number | null;
  currency: string;
  sessionId: string;
  mode: Stripe.Checkout.Session.Mode | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[stripe-webhook] resend_skipped (no API key)");
    return;
  }

  const studio =
    process.env.LEAD_TO_EMAIL ?? "caleb@weblogic.digital";
  const fromEmail =
    process.env.LEAD_FROM_EMAIL ??
    "WebLogic Support <support@weblogic.digital>";

  const amountFormatted =
    opts.amount != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: opts.currency.toUpperCase(),
          maximumFractionDigits: 0,
        }).format(opts.amount / 100)
      : "—";

  const isSubscription = opts.mode === "subscription";
  const customerSubject = isSubscription
    ? "Welcome to WebLogic Care"
    : "Deposit received — your WebLogic project slot is locked in";

  const recipientList: string[] = [studio];
  if (opts.to && opts.to !== studio) recipientList.push(opts.to);

  const html = `
  <!doctype html>
  <html><body style="margin:0;background:#000;color:#fff;font-family:Inter,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="font-family:ui-monospace,monospace;color:#0052ff;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;">
        / Payment confirmed
      </p>
      <h1 style="font-size:26px;line-height:1.15;margin:8px 0 16px;letter-spacing:-0.5px;">
        ${customerSubject}
      </h1>
      <p style="color:#cccccc;font-size:15px;line-height:1.5;">
        ${
          isSubscription
            ? "Your monthly care plan is active. Caleb will reach out within one business day with your support routes + first-month checklist."
            : "Your deposit cleared and your project slot is reserved. Caleb will email a project intake within one business day."
        }
      </p>
      <table role="presentation" style="margin-top:24px;width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.1);">
        ${row("Amount", amountFormatted)}
        ${row("Mode", String(opts.mode ?? "—"))}
        ${row("Package", opts.metadata.packageName ?? opts.metadata.packageKey ?? "—")}
        ${row("Plan", opts.metadata.carePlanName ?? opts.metadata.carePlanKey ?? "—")}
        ${row("Add-ons", opts.metadata.selectedAddons ?? "—")}
        ${row("Stripe session", opts.sessionId)}
      </table>
      <p style="margin-top:32px;color:#8e8e93;font-size:12px;">
        Reply to this email to reach Caleb directly.
      </p>
    </div>
  </body></html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipientList,
        subject: customerSubject,
        html,
        reply_to: studio,
      }),
    });
    if (res.ok) {
      console.log("[stripe-webhook] confirmation_email_sent");
    } else {
      const body = await res.text().catch(() => "");
      console.error(
        "[stripe-webhook] confirmation_email_failed",
        res.status,
        body,
      );
    }
  } catch (err) {
    console.error("[stripe-webhook] confirmation_email_threw", err);
  }
}

function row(k: string, v: string): string {
  if (!v || v === "—") {
    return `<tr><td style="padding:8px 12px;color:#8e8e93;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;font-family:ui-monospace,monospace;">${k}</td><td style="padding:8px 12px;color:#8e8e93;font-size:14px;">—</td></tr>`;
  }
  return `<tr><td style="padding:8px 12px;color:#8e8e93;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;font-family:ui-monospace,monospace;">${k}</td><td style="padding:8px 12px;color:#fff;font-size:14px;">${escapeHtml(
    v,
  )}</td></tr>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
