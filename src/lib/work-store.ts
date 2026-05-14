/**
 * Work store — server-side read + write of the WorkItem list.
 *
 *  • `getWorkItems()` reads `public/uploads/work-items.json` if present and
 *    returns whatever the admin saved. Falls back to CASE_STUDIES from data.ts
 *    when the JSON is missing (fresh install or never edited).
 *  • `saveWorkItemsAction(items)` is a Next.js Server Action used by the admin
 *    Work Manager. It validates, writes the JSON, and revalidates the routes
 *    that read it.
 *  • `resetWorkItemsAction()` deletes the JSON so the site reverts to defaults.
 *
 * Storage is intentionally a single JSON file under /public/uploads so it sits
 * next to the user-uploaded media + manifest — same git-ignored directory.
 */

"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CASE_STUDIES } from "@/lib/data";
import type { CaseStudy } from "@/types";

const STORE_PATH = path.join(process.cwd(), "public", "uploads", "work-items.json");

const LabelSchema = z.enum([
  "Real Client",
  "Demo",
  "Concept",
  "Internal Build",
  "Performance Demo",
]);

const MetricSchema = z.object({
  label: z.string().max(80),
  value: z.string().max(80),
});

const WorkItemSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  client: z.string().min(1).max(120),
  logo: z.string().max(120).default(""),
  industry: z.string().max(160).default(""),
  category: z.string().max(120).default(""),
  label: LabelSchema,
  headline: z.string().max(280).default(""),
  summary: z.string().max(600).default(""),
  story: z.string().max(4000).default(""),
  metrics: z.array(MetricSchema).max(8).default([]),
  stack: z.array(z.string().max(60)).max(20).default([]),
  services: z.array(z.string().max(60)).max(20).optional(),
  videoSlot: z.string().max(80).default(""),
  accentColor: z.string().max(20).optional(),
  duration: z.string().max(80).default(""),
  href: z.string().max(240).default("#"),
  tags: z.array(z.string().max(40)).max(10).optional(),
  year: z.string().max(20).optional(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
  liveUrl: z.string().max(300).optional(),
  githubUrl: z.string().max(300).optional(),
  caseStudyUrl: z.string().max(300).optional(),
  poster: z.string().max(300).optional(),
});

const StoreSchema = z.object({
  items: z.array(WorkItemSchema),
  updatedAt: z.string().optional(),
});

type ParsedStore = z.infer<typeof StoreSchema>;

async function readStore(): Promise<ParsedStore | null> {
  try {
    const buf = await fs.readFile(STORE_PATH, "utf8");
    const json = JSON.parse(buf);
    const parsed = StoreSchema.safeParse(json);
    if (!parsed.success) {
      console.error("[work-store] invalid JSON, falling back to defaults", parsed.error);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

/** Public read — used by RSCs to render the gallery + work pages. */
export async function getWorkItems(): Promise<CaseStudy[]> {
  const store = await readStore();
  if (store && store.items.length > 0) return store.items as CaseStudy[];
  return CASE_STUDIES;
}

/**
 * Server Action — persist the full items list. Called from the admin CRUD UI.
 * Returns { ok, error? } so the client can show a toast.
 */
export async function saveWorkItemsAction(
  items: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = z.array(WorkItemSchema).safeParse(items);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    };
  }
  // Guard against duplicate slugs — they break /work/[slug] routing.
  const slugs = new Set<string>();
  for (const it of parsed.data) {
    if (slugs.has(it.slug)) {
      return { ok: false, error: `Duplicate slug "${it.slug}"` };
    }
    slugs.add(it.slug);
  }

  const payload: ParsedStore = {
    items: parsed.data,
    updatedAt: new Date().toISOString(),
  };

  try {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(payload, null, 2), "utf8");
  } catch (err) {
    console.error("[work-store] save failed", err);
    return { ok: false, error: "Filesystem write failed (read-only host?)" };
  }

  // Refresh every route that reads this list.
  revalidatePath("/");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/admin/dashboard/work");

  return { ok: true };
}

/** Reset to the defaults baked into data.ts. */
export async function resetWorkItemsAction(): Promise<{ ok: boolean }> {
  try {
    await fs.unlink(STORE_PATH);
  } catch {
    // already absent — fine
  }
  revalidatePath("/");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/admin/dashboard/work");
  return { ok: true };
}
