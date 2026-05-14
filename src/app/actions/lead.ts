"use server";

import { z } from "zod";
import { promises as fs } from "node:fs";
import path from "node:path";

const LeadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  company: z.string().min(1).max(160),
  role: z.string().max(120).optional().default(""),
  budget: z.string().max(40).optional().default(""),
  timeline: z.string().max(40).optional().default(""),
  scope: z.string().max(80).optional().default(""),
  currentUrl: z.string().max(240).optional().default(""),
  problem: z.string().max(2000).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  source: z.string().max(80).optional().default("modal"),
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

export async function submitLead(input: LeadInput): Promise<SubmitResult> {
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

  // 1) Local jsonl log — always succeeds in dev
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(LOG_PATH, JSON.stringify(lead) + "\n", "utf8");
    delivery.log = true;
  } catch (err) {
    console.error("[lead] log write failed", err);
  }

  // 2) Resend email — sends if RESEND_API_KEY + LEAD_TO_EMAIL are set
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL;
  const fromEmail =
    process.env.LEAD_FROM_EMAIL ?? "WebLogic <onboarding@resend.dev>";

  if (apiKey && toEmail) {
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
      "[lead] Resend not configured. Set RESEND_API_KEY and LEAD_TO_EMAIL in .env.local to enable email delivery.",
    );
  }

  // 3) Optional generic webhook (HubSpot/Salesforce/Slack/etc.)
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

  return { ok: true, delivery };
}

/* ---------- helpers ---------- */

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "lead_" + Math.random().toString(36).slice(2);
}

function renderLeadEmail(lead: LeadInput & { receivedAt: string; id: string }) {
  const row = (k: string, v: string) =>
    v
      ? `<tr><td style="padding:8px 12px;color:#8e8e93;font-family:ui-monospace,monospace;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;vertical-align:top;">${k}</td><td style="padding:8px 12px;color:#fff;font-family:Inter,sans-serif;font-size:14px;">${escapeHtml(v)}</td></tr>`
      : "";

  return `
  <!doctype html>
  <html>
    <body style="margin:0;background:#000;color:#fff;font-family:Inter,sans-serif;">
      <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
        <p style="font-family:ui-monospace,monospace;color:#0052ff;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;">
          / New WebLogic lead
        </p>
        <h1 style="font-size:28px;line-height:1.1;margin:8px 0 24px;letter-spacing:-1px;">
          ${escapeHtml(lead.name)} — ${escapeHtml(lead.company)}
        </h1>
        <table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.1);">
          ${row("Email", lead.email)}
          ${row("Role", lead.role || "")}
          ${row("Current URL", lead.currentUrl || "")}
          ${row("Scope", lead.scope || "")}
          ${row("Budget", lead.budget || "")}
          ${row("Timeline", lead.timeline || "")}
          ${row("Biggest problem", lead.problem || "")}
          ${row("Source", lead.source || "")}
          ${row("Notes", lead.notes || "")}
          ${row("Received", lead.receivedAt)}
        </table>
        <p style="margin-top:32px;color:#8e8e93;font-size:12px;">
          Reply to this email to respond directly. Lead ID: ${lead.id}
        </p>
      </div>
    </body>
  </html>`;
}

function renderLeadText(lead: LeadInput & { receivedAt: string; id: string }) {
  return [
    `New WebLogic lead`,
    `─────────────────`,
    `Name:        ${lead.name}`,
    `Company:     ${lead.company}`,
    `Email:       ${lead.email}`,
    `Role:        ${lead.role}`,
    `Current URL: ${lead.currentUrl}`,
    `Scope:       ${lead.scope}`,
    `Budget:      ${lead.budget}`,
    `Timeline:    ${lead.timeline}`,
    `Problem:     ${lead.problem}`,
    `Source:      ${lead.source}`,
    `Notes:       ${lead.notes}`,
    ``,
    `Received: ${lead.receivedAt}`,
    `ID:       ${lead.id}`,
  ].join("\n");
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
