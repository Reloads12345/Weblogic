"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { reportError, reportWarning } from "@/lib/error-reporter";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Server action that runs a free site audit for a visitor.
 *
 * Pipeline:
 *   1. Normalize + validate the URL (Zod + URL constructor).
 *   2. Rate-limit per IP (4/hour, same as the lead form).
 *   3. Call Google PageSpeed Insights API (mobile strategy by default).
 *   4. Distill the response into a small payload the client renders.
 *   5. If RESEND_API_KEY + the visitor's email are present, also send
 *      a fuller HTML report — that lets us capture a lead without
 *      forcing the visitor through the lead modal.
 *
 * Env:
 *   GOOGLE_PAGESPEED_API_KEY  (recommended — without it the request
 *                               still works but is rate-limited)
 *
 * Returns ALWAYS a structured `{ ok, ... }` so the client never has to
 * try/catch.
 */

const AuditSchema = z.object({
  url: z.string().min(4).max(1024),
  /** Optional — capture an email for the full report. */
  email: z.string().email().max(160).optional(),
  /** Optional — attribution source for analytics. */
  source: z.string().max(80).optional().default("audit-widget"),
});

export type AuditInput = z.input<typeof AuditSchema>;

export interface AuditResult {
  ok: boolean;
  error?: string;
  /** Normalized URL the audit ran against. */
  url?: string;
  /** Scores are 0-100 (rounded). null when Lighthouse skipped a category. */
  scores?: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
  /** Core Web Vitals — null when unavailable. */
  metrics?: {
    lcp: { value: number; display: string } | null;
    cls: { value: number; display: string } | null;
    tbt: { value: number; display: string } | null;
  };
  /** Top 3 opportunities surfaced by Lighthouse, ranked by impact. */
  wins?: { title: string; savingsMs?: number; description?: string }[];
  /** True when we successfully queued a follow-up email. */
  emailQueued?: boolean;
}

/* ─────────────────────── Rate limit ─────────────────────── */

// Durable when Vercel KV is provisioned, in-memory fallback otherwise.
const RATE_MAX = 4;
const RATE_WINDOW_SEC = 60 * 60;

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

/**
 * Rate-limit the audit by IP *and*, when an email is supplied, by email.
 * The email key matters because the report-email path can address an
 * arbitrary recipient — capping per-email blocks anyone from using the
 * tool to fan WebLogic-branded mail out across many addresses from one IP.
 */
async function auditRateLimited(email?: string): Promise<boolean> {
  const ip = await getClientIp();
  const checks = [rateLimit(`audit:ip:${ip}`, RATE_MAX, RATE_WINDOW_SEC)];
  if (email) {
    checks.push(
      rateLimit(`audit:email:${email.toLowerCase()}`, 2, 24 * 60 * 60),
    );
  }
  const results = await Promise.all(checks);
  return results.some((r) => r.limited);
}

/* ─────────────────────── Normalization ─────────────────────── */

function normalizeUrl(raw: string): string | null {
  let s = raw.trim();
  if (!s) return null;
  // Accept "example.com" without scheme — most visitors don't paste a full URL.
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  try {
    const u = new URL(s);
    // Reject obvious garbage / private addresses so we don't pay
    // PageSpeed quota for localhost probes.
    if (!u.hostname.includes(".")) return null;
    if (
      /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0)/.test(u.hostname)
    ) {
      return null;
    }
    return u.toString();
  } catch {
    return null;
  }
}

/* ─────────────────────── PageSpeed call ─────────────────────── */

interface PSILighthouse {
  categories?: Record<string, { score: number | null }>;
  audits?: Record<
    string,
    {
      title?: string;
      description?: string;
      score?: number | null;
      displayValue?: string;
      numericValue?: number;
      details?: { overallSavingsMs?: number };
    }
  >;
}

interface PSIResponse {
  lighthouseResult?: PSILighthouse;
  error?: { message?: string };
}

async function runPageSpeed(url: string): Promise<AuditResult> {
  const key = process.env.GOOGLE_PAGESPEED_API_KEY;
  // PSI URL — five categories in one call, mobile strategy by default
  // because that's where most of our visitors' customers actually browse.
  const psi = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  psi.searchParams.set("url", url);
  psi.searchParams.set("strategy", "mobile");
  ["performance", "accessibility", "best-practices", "seo"].forEach((c) =>
    psi.searchParams.append("category", c),
  );
  if (key) psi.searchParams.set("key", key);

  let json: PSIResponse;
  try {
    const res = await fetch(psi.toString(), {
      // 90s — PSI is slow, especially on cold targets.
      signal: AbortSignal.timeout(90_000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      reportWarning(new Error(`PSI HTTP ${res.status}: ${body.slice(0, 200)}`), {
        route: "audit",
        tags: { url, status: res.status },
      });
      return {
        ok: false,
        error:
          res.status === 429
            ? "Too many audits right now — try again in a few minutes."
            : "Couldn't reach the audit service. Try again in a minute.",
      };
    }
    json = (await res.json()) as PSIResponse;
  } catch (err) {
    reportError(err, { route: "audit", tags: { url } });
    return {
      ok: false,
      error: "The audit timed out. Try a more responsive URL or try again.",
    };
  }

  const lh = json.lighthouseResult;
  if (!lh) {
    return {
      ok: false,
      error: json.error?.message ?? "No Lighthouse data returned for that URL.",
    };
  }

  const cat = (id: string) =>
    typeof lh.categories?.[id]?.score === "number"
      ? Math.round((lh.categories[id].score as number) * 100)
      : null;

  const audit = (id: string) => lh.audits?.[id];

  const lcp = audit("largest-contentful-paint");
  const cls = audit("cumulative-layout-shift");
  const tbt = audit("total-blocking-time");

  // Pick top 3 opportunity audits by savings, where score < 0.9 (so we
  // don't surface near-passes as "wins").
  const opportunities = Object.entries(lh.audits ?? {})
    .filter(([, a]) => {
      const savings = a.details?.overallSavingsMs ?? 0;
      return (a.score ?? 1) < 0.9 && savings > 100;
    })
    .sort(
      (a, b) =>
        (b[1].details?.overallSavingsMs ?? 0) -
        (a[1].details?.overallSavingsMs ?? 0),
    )
    .slice(0, 3)
    .map(([, a]) => ({
      title: a.title ?? "Opportunity",
      savingsMs: a.details?.overallSavingsMs,
      description: a.description?.split(".")[0] + ".",
    }));

  return {
    ok: true,
    url,
    scores: {
      performance: cat("performance"),
      accessibility: cat("accessibility"),
      bestPractices: cat("best-practices"),
      seo: cat("seo"),
    },
    metrics: {
      lcp: lcp
        ? { value: lcp.numericValue ?? 0, display: lcp.displayValue ?? "—" }
        : null,
      cls: cls
        ? { value: cls.numericValue ?? 0, display: cls.displayValue ?? "—" }
        : null,
      tbt: tbt
        ? { value: tbt.numericValue ?? 0, display: tbt.displayValue ?? "—" }
        : null,
    },
    wins: opportunities,
  };
}

/* ─────────────────────── Email follow-up ─────────────────────── */

async function emailFullReport(
  to: string,
  url: string,
  result: AuditResult,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const fromEmail =
    process.env.LEAD_FROM_EMAIL ??
    "WebLogic Support <support@weblogic.digital>";
  const studio = process.env.LEAD_TO_EMAIL ?? "caleb@weblogic.digital";

  const scoreRow = (label: string, score: number | null) =>
    `<tr><td style="padding:6px 12px;color:#8e8e93;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;font-family:ui-monospace,monospace;">${label}</td>` +
    `<td style="padding:6px 12px;color:${score == null ? "#8e8e93" : score >= 90 ? "#0052ff" : score >= 50 ? "#ffffff" : "#ff7755"};font-size:18px;font-weight:600;">${score ?? "—"}</td></tr>`;

  const html = `
  <!doctype html>
  <html><body style="margin:0;background:#000;color:#fff;font-family:Inter,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="font-family:ui-monospace,monospace;color:#0052ff;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;">
        / Site audit · ${escapeHtml(new URL(url).hostname)}
      </p>
      <h1 style="font-size:26px;line-height:1.15;margin:8px 0 16px;letter-spacing:-0.5px;">
        Your free audit is ready.
      </h1>
      <p style="color:#8e8e93;font-size:12px;line-height:1.5;margin:0 0 12px;">
        You requested this free audit at weblogic.digital. If you didn't,
        you can safely ignore this email — no further messages will be sent.
      </p>
      <p style="color:#cccccc;font-size:15px;line-height:1.5;">
        Mobile Lighthouse scores for <a href="${escapeHtml(url)}" style="color:#0052ff;">${escapeHtml(url)}</a>. The full report has more — reply to this email if you want a written plan + fixed quote.
      </p>
      <table role="presentation" style="margin-top:24px;width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,0.1);">
        ${scoreRow("Performance", result.scores?.performance ?? null)}
        ${scoreRow("Accessibility", result.scores?.accessibility ?? null)}
        ${scoreRow("Best practices", result.scores?.bestPractices ?? null)}
        ${scoreRow("SEO", result.scores?.seo ?? null)}
      </table>
      ${
        result.wins && result.wins.length > 0
          ? `<h2 style="margin-top:32px;font-size:18px;">Top wins</h2><ul style="color:#cccccc;font-size:14px;line-height:1.6;padding-left:20px;">${result.wins
              .map(
                (w) =>
                  `<li><strong style="color:#fff;">${escapeHtml(w.title)}</strong>${
                    w.savingsMs
                      ? ` — save ~${Math.round(w.savingsMs / 100) / 10}s`
                      : ""
                  }</li>`,
              )
              .join("")}</ul>`
          : ""
      }
      <p style="margin-top:32px;color:#8e8e93;font-size:12px;">
        Reply with "audit" to get the full written plan + fixed quote within 24 hours.
      </p>
    </div>
  </body></html>`;

  // Two SEPARATE sends, deliberately not bundled into one recipient list:
  //   1. The report → the visitor's (unverified) address. Solicited
  //      framing + per-email rate cap upstream make this safe to send.
  //   2. A lead notice → the studio's FIXED address. Never to a
  //      user-controlled recipient, so the audit tool can't be turned
  //      into a relay that mails arbitrary addresses on the studio's behalf.
  const send = (payload: Record<string, unknown>) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from: fromEmail, ...payload }),
    });

  try {
    // 1) Report to the visitor.
    const res = await send({
      to: [to],
      subject: `Your WebLogic audit — ${new URL(url).hostname}`,
      html,
      reply_to: studio,
    });

    // 2) Lead notice to the studio (best-effort; failure here doesn't
    //    affect the visitor-facing result).
    if (to !== studio) {
      await send({
        to: [studio],
        subject: `New audit lead — ${new URL(url).hostname} (${to})`,
        html: `<p style="font-family:sans-serif">Audit requested for <a href="${escapeHtml(
          url,
        )}">${escapeHtml(url)}</a> by <strong>${escapeHtml(
          to,
        )}</strong>.</p><p style="font-family:sans-serif;color:#666">Perf ${
          result.scores?.performance ?? "—"
        } · SEO ${result.scores?.seo ?? "—"} · A11y ${
          result.scores?.accessibility ?? "—"
        }</p>`,
        reply_to: to,
      }).catch(() => {});
    }

    return res.ok;
  } catch (err) {
    reportWarning(err, { route: "audit", tags: { stage: "email", url } });
    return false;
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ─────────────────────── Entry point ─────────────────────── */

export async function runAudit(input: AuditInput): Promise<AuditResult> {
  const parsed = AuditSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the URL and try again." };
  }

  const url = normalizeUrl(parsed.data.url);
  if (!url) {
    return {
      ok: false,
      error: "That doesn't look like a public URL. Try something like example.com.",
    };
  }

  if (await auditRateLimited(parsed.data.email)) {
    return {
      ok: false,
      error:
        "You've run several audits in a row. Please wait an hour or email caleb@weblogic.digital.",
    };
  }

  const result = await runPageSpeed(url);
  if (!result.ok) return result;

  // Structured log so Vercel captures the audit even when we can't email it.
  console.log(
    "[audit] completed",
    JSON.stringify({
      url,
      source: parsed.data.source,
      perf: result.scores?.performance,
      seo: result.scores?.seo,
      hasEmail: Boolean(parsed.data.email),
    }),
  );

  if (parsed.data.email) {
    const ok = await emailFullReport(parsed.data.email, url, result);
    return { ...result, emailQueued: ok };
  }

  return result;
}
