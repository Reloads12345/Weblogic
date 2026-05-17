"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { promises as fs } from "node:fs";
import path from "node:path";

/* ----------------------------------------------------------------------------
   Lead submission Server Action.

   Pipeline:
     1) Honeypot + rate-limit guard
     2) Zod-validate the payload
     3) Append to a local jsonl log (best-effort; ignored on read-only hosts)
     4) Email via Resend if RESEND_API_KEY + LEAD_TO_EMAIL are set
     5) POST to an optional generic webhook (HubSpot / Slack / Make.com)

   Returns `{ ok: boolean, delivery: { email, webhook, log } }` so the
   client can show accurate success / partial-failure messaging.
---------------------------------------------------------------------------- */

const ChecklistSchema = z.object({
  hasWebsite: z.enum(["yes", "no"]).optional(),
  mobileFriendly: z.enum(["yes", "no", "unsure"]).optional(),
  enoughLeads: z.enum(["yes", "no"]).optional(),
  needs: z.array(z.string().max(40)).max(10).optional(),
  needsSeo: z.enum(["yes", "no", "unsure"]).optional(),
  buildType: z.enum(["redesign", "new-build", "not-sure"]).optional(),
});

const LeadSchema = z.object({
  // Contact
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().default(""),
  company: z.string().min(1).max(160),
  role: z.string().max(120).optional().default(""),

  // Project basics
  currentUrl: z.string().max(240).optional().default(""),
  scope: z.string().max(80).optional().default(""),
  budget: z.string().max(40).optional().default(""),
  timeline: z.string().max(40).optional().default(""),
  problem: z.string().max(2000).optional().default(""),
  notes: z.string().max(2000).optional().default(""),

  // Audit checklist (all optional — never required to submit)
  checklist: ChecklistSchema.optional().default({}),

  // Source attribution
  source: z.string().max(80).optional().default("modal"),

  // Honeypot — if a bot fills this, we silently drop the submission.
  // Real users never see this field so it should always arrive empty.
  website: z.string().max(0).optional().default(""),
});

export type LeadInput = z.input<typeof LeadSchema>;

const LOG_DIR = path.join(process.cwd(), "public", "uploads");
const LOG_PATH = path.join(LOG_DIR, "leads.log.jsonl");

interface SubmitResult {
  ok: boolean;
  error?: string;
  delivery?: {
    email: boolean;
    webhook: boolean;
    log: boolean;
  };
}

/* ----------------------- Rate limit (in-memory) ----------------------- */

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 4; // submissions per IP per window

async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    return h.get("x-real-ip") ?? "unknown";
  } catch {
    return "unknown";
  }
}

async function rateLimited(): Promise<boolean> {
  const ip = await getClientIp();
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || entry.resetAt < now) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_MAX) return true;
  entry.count += 1;
  return false;
}

/* ----------------------- Entry point ----------------------- */

export async function submitLead(input: LeadInput): Promise<SubmitResult> {
  // 0) Honeypot — silently succeed so bots think they hit the form, but
  //    deliver nothing anywhere.
  if (typeof input.website === "string" && input.website.length > 0) {
    return { ok: true, delivery: { email: false, webhook: false, log: false } };
  }

  // 1) Rate limit — friendly error, don't lecture.
  if (await rateLimited()) {
    return {
      ok: false,
      error:
        "You've sent a few requests in a row. Please wait an hour or email caleb@weblogic.digital directly.",
    };
  }

  // 2) Validate
  const parsed = LeadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const lead = {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
    id: cryptoRandomId(),
  };

  const delivery = { email: false, webhook: false, log: false };

  // 3) Local jsonl log — best-effort. Fails silently on read-only hosts
  //    (Vercel runtime); local dev / self-hosted Node will succeed.
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(LOG_PATH, JSON.stringify(lead) + "\n", "utf8");
    delivery.log = true;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[lead] log write skipped (read-only fs?)", err);
    }
  }

  // 4) Resend email
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL ?? "caleb@weblogic.digital";
  const fromEmail =
    process.env.LEAD_FROM_EMAIL ?? "WebLogic <onboarding@resend.dev>";

  if (apiKey) {
    try {
      const subject = `New lead — ${lead.name} @ ${lead.company} (${lead.source})`;
      const html = renderLeadEmail(lead);
      const text = renderLeadText(lead);

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject,
          html,
          text,
          reply_to: lead.email,
        }),
      });

      if (res.ok) {
        delivery.email = true;
      } else {
        const body = await res.text().catch(() => "");
        console.error("[lead] Resend rejected:", res.status, body);
      }
    } catch (err) {
      console.error("[lead] Resend send failed", err);
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[lead] Resend not configured. Set RESEND_API_KEY + LEAD_TO_EMAIL in env.",
    );
  }

  // 5) Optional generic webhook (HubSpot / Salesforce / Slack / Make.com)
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (res.ok) delivery.webhook = true;
    } catch (err) {
      console.error("[lead] webhook failed", err);
    }
  }

  // If neither email nor webhook delivered AND we couldn't log to disk,
  // surface a graceful error so the client can ask the user to email
  // directly instead of silently failing.
  if (!delivery.email && !delivery.webhook && !delivery.log) {
    return {
      ok: false,
      error:
        "We couldn't deliver your request. Please email caleb@weblogic.digital and we'll respond within 24 hours.",
      delivery,
    };
  }

  return { ok: true, delivery };
}

/* ----------------------- Helpers ----------------------- */

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "lead_" + Math.random().toString(36).slice(2);
}

type FullLead = z.output<typeof LeadSchema> & {
  receivedAt: string;
  id: string;
};

function renderLeadEmail(lead: FullLead) {
  const row = (k: string, v: string) =>
    v && v.trim().length > 0
      ? `<tr><td style="padding:8px 12px;color:#8e8e93;font-family:ui-monospace,monospace;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;vertical-align:top;width:160px;">${k}</td><td style="padding:8px 12px;color:#fff;font-family:Inter,sans-serif;font-size:14px;">${escapeHtml(v)}</td></tr>`
      : "";

  const checklistRow = (k: string, v: string | undefined) =>
    v ? row(k, friendly(v)) : "";

  const checklistNeeds = lead.checklist?.needs?.length
    ? row("Needs (feature picks)", lead.checklist.needs.join(", "))
    : "";

  return `
  <!doctype html>
  <html>
    <body style="margin:0;background:#000;color:#fff;font-family:Inter,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:32px 24px;">
        <p style="font-family:ui-monospace,monospace;color:#0052ff;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;">
          / New WebLogic lead
        </p>
        <h1 style="font-size:28px;line-height:1.1;margin:8px 0 24px;letter-spacing:-1px;">
          ${escapeHtml(lead.name)} — ${escapeHtml(lead.company)}
        </h1>

        <h2 style="font-size:14px;color:#0052ff;text-transform:uppercase;letter-spacing:1.5px;font-family:ui-monospace,monospace;margin:24px 0 8px;">
          / Contact
        </h2>
        <table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.1);">
          ${row("Email", lead.email)}
          ${row("Phone", lead.phone)}
          ${row("Role", lead.role)}
          ${row("Company", lead.company)}
        </table>

        <h2 style="font-size:14px;color:#0052ff;text-transform:uppercase;letter-spacing:1.5px;font-family:ui-monospace,monospace;margin:24px 0 8px;">
          / Project
        </h2>
        <table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.1);">
          ${row("Current URL", lead.currentUrl)}
          ${row("Scope", lead.scope)}
          ${row("Budget", lead.budget)}
          ${row("Timeline", lead.timeline)}
          ${row("Biggest problem", lead.problem)}
        </table>

        <h2 style="font-size:14px;color:#0052ff;text-transform:uppercase;letter-spacing:1.5px;font-family:ui-monospace,monospace;margin:24px 0 8px;">
          / Site audit checklist
        </h2>
        <table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.1);">
          ${checklistRow("Has a website?", lead.checklist?.hasWebsite)}
          ${checklistRow("Mobile-friendly?", lead.checklist?.mobileFriendly)}
          ${checklistRow("Getting enough leads?", lead.checklist?.enoughLeads)}
          ${checklistRow("Needs SEO?", lead.checklist?.needsSeo)}
          ${checklistRow("Redesign or new build?", lead.checklist?.buildType)}
          ${checklistNeeds}
        </table>

        <h2 style="font-size:14px;color:#0052ff;text-transform:uppercase;letter-spacing:1.5px;font-family:ui-monospace,monospace;margin:24px 0 8px;">
          / Meta
        </h2>
        <table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.1);">
          ${row("Source", lead.source)}
          ${row("Notes", lead.notes)}
          ${row("Received", lead.receivedAt)}
        </table>

        <p style="margin-top:32px;color:#8e8e93;font-size:12px;">
          Reply to this email to respond directly. Lead ID: ${lead.id}
        </p>
      </div>
    </body>
  </html>`;
}

function renderLeadText(lead: FullLead) {
  const needs = lead.checklist?.needs?.join(", ") || "";
  return [
    `New WebLogic lead`,
    `─────────────────`,
    `Name:        ${lead.name}`,
    `Company:     ${lead.company}`,
    `Email:       ${lead.email}`,
    `Phone:       ${lead.phone}`,
    `Role:        ${lead.role}`,
    ``,
    `Current URL: ${lead.currentUrl}`,
    `Scope:       ${lead.scope}`,
    `Budget:      ${lead.budget}`,
    `Timeline:    ${lead.timeline}`,
    `Problem:     ${lead.problem}`,
    ``,
    `── Site audit checklist`,
    `Has website?      ${friendly(lead.checklist?.hasWebsite)}`,
    `Mobile-friendly?  ${friendly(lead.checklist?.mobileFriendly)}`,
    `Enough leads?     ${friendly(lead.checklist?.enoughLeads)}`,
    `Needs SEO?        ${friendly(lead.checklist?.needsSeo)}`,
    `Build type?       ${friendly(lead.checklist?.buildType)}`,
    `Needs:            ${needs}`,
    ``,
    `Source:           ${lead.source}`,
    `Notes:            ${lead.notes}`,
    `Received:         ${lead.receivedAt}`,
    `ID:               ${lead.id}`,
  ].join("\n");
}

function friendly(v: string | undefined): string {
  if (!v) return "—";
  return v
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br/>");
}
