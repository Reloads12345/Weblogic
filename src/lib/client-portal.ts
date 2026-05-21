/**
 * Client portal data store.
 *
 * Each WebLogic client gets a unique URL `/portal/<token>` where `token`
 * is an opaque random string. Access control is "URL is the secret" —
 * no login UI, no password, no email confirmation. Trade-offs:
 *   • Cheap to ship and to use (clients click their bookmark).
 *   • Tokens MUST be long + random (we use 32 hex chars = 128 bits).
 *   • If a token leaks, rotate it by issuing a new entry.
 *   • Tokens are stored in the same Vercel Blob the upload route uses,
 *     under `portal/clients.json`. In dev they live on the filesystem
 *     under public/uploads/portal/clients.json.
 *
 * In dev with no clients configured, the route returns a single DEMO
 * client so the operator can preview the UI without writing data.
 *
 * Upgrade paths (when you outgrow this):
 *   • Move to Supabase / Postgres for auditable history.
 *   • Add NextAuth so clients can log in with email magic link.
 *   • Layer signed JWT URLs with TTL so leaked tokens expire.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { head, put } from "@vercel/blob";

/* ───────────────────────────── Schema ───────────────────────────── */

const MilestoneStatus = z.enum([
  "complete",
  "in-progress",
  "upcoming",
  "blocked",
]);
export type MilestoneStatus = z.infer<typeof MilestoneStatus>;

const FileLink = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  kind: z.enum(["doc", "video", "design", "code", "other"]).default("doc"),
});
export type FileLink = z.infer<typeof FileLink>;

const Milestone = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  status: MilestoneStatus,
  due: z.string().optional(),
});
export type Milestone = z.infer<typeof Milestone>;

const ClientProject = z.object({
  token: z.string().min(8),
  client: z.string().min(1),
  company: z.string().min(1),
  projectName: z.string().min(1),
  startedAt: z.string(),
  /** e.g. "On track", "Awaiting client review", "Paused" */
  statusLine: z.string().default("On track"),
  /** Stripe Customer Portal session URL or any billing self-serve URL. */
  billingPortalUrl: z.string().url().optional(),
  /** Optional Cal.com link for the client to book a check-in with Caleb. */
  calLink: z.string().optional(),
  contactEmail: z.string().email().default("caleb@weblogic.digital"),
  milestones: z.array(Milestone).default([]),
  files: z.array(FileLink).default([]),
  /** Free-form changelog of recent activity, newest first. */
  recentActivity: z
    .array(
      z.object({
        at: z.string(),
        kind: z.enum(["update", "delivery", "payment", "note"]).default("update"),
        text: z.string(),
      }),
    )
    .default([]),
});
export type ClientProject = z.infer<typeof ClientProject>;

const ClientStore = z.array(ClientProject);

/* ───────────────────────────── Storage ───────────────────────────── */

const IS_VERCEL = process.env.VERCEL === "1";
const HAS_BLOB_TOKEN = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const FS_PATH = path.join(
  process.cwd(),
  "public",
  "uploads",
  "portal",
  "clients.json",
);
const BLOB_PATH = "portal/clients.json";

async function readStoreFromFs(): Promise<ClientProject[]> {
  try {
    const raw = await fs.readFile(FS_PATH, "utf8");
    const parsed = ClientStore.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

async function readStoreFromBlob(): Promise<ClientProject[]> {
  try {
    // `head` is cheaper than `list` for a known path; gives us the URL +
    // 404s if the blob doesn't exist yet.
    const h = await head(`${process.env.BLOB_PUBLIC_URL_PREFIX ?? ""}${BLOB_PATH}`).catch(
      () => null,
    );
    if (!h?.url) return [];
    const res = await fetch(h.url, { cache: "no-store" });
    if (!res.ok) return [];
    const parsed = ClientStore.safeParse(await res.json());
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

/**
 * Returns the configured client store. Empty array if nothing is
 * configured — callers fall back to the demo client.
 */
export async function readClientStore(): Promise<ClientProject[]> {
  if (IS_VERCEL && HAS_BLOB_TOKEN) return readStoreFromBlob();
  return readStoreFromFs();
}

/**
 * Look up a single client by token. Constant-time-ish: we always walk
 * the full list so the response time doesn't leak whether the token
 * matched on the first or last entry. With 5-50 clients this is
 * sub-millisecond either way.
 */
export async function findClientByToken(
  token: string,
): Promise<ClientProject | null> {
  if (!token || token.length < 8) return null;
  const store = await readClientStore();
  let match: ClientProject | null = null;
  for (const c of store) {
    if (constantTimeEq(c.token, token)) match = c;
  }
  return match;
}

function constantTimeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let m = 0;
  for (let i = 0; i < a.length; i++) m |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return m === 0;
}

/* ───────────────────────────── Writes (admin-only) ─────────────────────── */

/**
 * Replace the entire store. Admin-gated route handlers should call this
 * after Zod-validating the input. We persist as a single JSON blob so
 * there's no concurrent-write race — `put` with overwrite is atomic on
 * Vercel Blob.
 */
export async function writeClientStore(store: ClientProject[]): Promise<void> {
  const parsed = ClientStore.parse(store);
  const json = JSON.stringify(parsed, null, 2);

  if (IS_VERCEL && HAS_BLOB_TOKEN) {
    await put(BLOB_PATH, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  await fs.mkdir(path.dirname(FS_PATH), { recursive: true });
  await fs.writeFile(FS_PATH, json, "utf8");
}

/* ───────────────────────────── Demo fallback ─────────────────────── */

/**
 * Static demo project surfaced when the store is empty. Lets operators
 * preview the portal UI immediately without populating data. Visible
 * only via /portal/demo (a hardcoded reserved token).
 */
export const DEMO_TOKEN = "demo";

export function demoClient(): ClientProject {
  return {
    token: DEMO_TOKEN,
    client: "Avery Reyes",
    company: "Acme Studio",
    projectName: "Marketing site rebuild + client portal",
    startedAt: new Date().toISOString().slice(0, 10),
    statusLine: "On track — design review this week",
    contactEmail: "caleb@weblogic.digital",
    calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "",
    milestones: [
      {
        title: "Discovery + audit",
        description:
          "Site audit, analytics review, content inventory, technical baseline (Lighthouse + RUM).",
        status: "complete",
        due: "Week 1",
      },
      {
        title: "Wireframes + IA",
        description:
          "Page hierarchy, conversion path mapping, mobile-first wireframes for 6 templates.",
        status: "complete",
        due: "Week 2",
      },
      {
        title: "Visual design",
        description:
          "Color system, typography, hero compositions, component library, hover/animation specs.",
        status: "in-progress",
        due: "Week 3",
      },
      {
        title: "Build",
        description:
          "Next.js implementation, CMS wiring, Stripe / Cal.com integrations, performance pass.",
        status: "upcoming",
        due: "Week 4–5",
      },
      {
        title: "QA + launch",
        description:
          "Accessibility audit, cross-device QA, DNS cutover plan, post-launch monitoring.",
        status: "upcoming",
        due: "Week 6",
      },
    ],
    files: [
      {
        label: "Project kickoff brief.pdf",
        href: "https://weblogic.digital/uploads/.gitkeep",
        kind: "doc",
      },
      {
        label: "Brand inspiration board",
        href: "https://weblogic.digital/uploads/.gitkeep",
        kind: "design",
      },
      {
        label: "Sitemap v2",
        href: "https://weblogic.digital/uploads/.gitkeep",
        kind: "doc",
      },
    ],
    recentActivity: [
      {
        at: new Date().toISOString().slice(0, 10),
        kind: "update",
        text: "Shipped visual design v1. Awaiting your review on the new hero compositions.",
      },
      {
        at: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
        kind: "delivery",
        text: "Wireframes for templates 1–6 uploaded to the files tab.",
      },
      {
        at: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
        kind: "note",
        text: "Confirmed scope: 6 templates, Cal.com booking, Stripe deposit flow.",
      },
    ],
  };
}
