"use client";

import { useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Star,
  StarOff,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { saveWorkItemsAction, resetWorkItemsAction } from "@/lib/work-store";
import type { CaseStudy, CaseLabel } from "@/types";
import { cn } from "@/lib/utils";

const LABELS: CaseLabel[] = [
  "Real Client",
  "Demo",
  "Concept",
  "Internal Build",
  "Performance Demo",
];

const EMPTY_ITEM = (slug: string): CaseStudy => ({
  slug,
  client: "New Project",
  logo: "",
  industry: "",
  category: "Internal Build",
  label: "Internal Build",
  headline: "",
  summary: "",
  story: "",
  metrics: [],
  stack: [],
  videoSlot: `case-${slug}`,
  duration: "Internal build",
  href: "#",
  tags: [],
  year: String(new Date().getFullYear()),
  featured: false,
  visible: true,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function WorkManagerClient({
  initialItems,
}: {
  initialItems: CaseStudy[];
}) {
  const [items, setItems] = useState<CaseStudy[]>(initialItems);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const mutate = (next: CaseStudy[]) => {
    setItems(next);
    setDirty(true);
  };

  const updateItem = (slug: string, patch: Partial<CaseStudy>) => {
    mutate(items.map((it) => (it.slug === slug ? { ...it, ...patch } : it)));
  };

  const toggleVisible = (slug: string) => {
    const cur = items.find((i) => i.slug === slug);
    if (!cur) return;
    updateItem(slug, { visible: cur.visible === false ? true : false });
  };
  const toggleFeatured = (slug: string) => {
    const cur = items.find((i) => i.slug === slug);
    if (!cur) return;
    updateItem(slug, { featured: !cur.featured });
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    mutate(next);
  };
  const moveDown = (idx: number) => {
    if (idx >= items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    mutate(next);
  };

  const deleteItem = (slug: string) => {
    if (!window.confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    mutate(items.filter((i) => i.slug !== slug));
    if (openSlug === slug) setOpenSlug(null);
  };

  const addNew = () => {
    const base = "new-project";
    let candidate = base;
    let n = 1;
    while (items.some((i) => i.slug === candidate)) {
      candidate = `${base}-${++n}`;
    }
    const next = EMPTY_ITEM(candidate);
    mutate([next, ...items]);
    setOpenSlug(candidate);
  };

  const save = () => {
    setToast(null);
    startTransition(async () => {
      const res = await saveWorkItemsAction(items);
      if (res.ok) {
        setDirty(false);
        setToast({ ok: true, msg: "Saved. Live site updated." });
      } else {
        setToast({ ok: false, msg: res.error ?? "Save failed." });
      }
      window.setTimeout(() => setToast(null), 4000);
    });
  };

  const resetToDefaults = () => {
    if (!window.confirm("Reset to the default project list? Your edits will be lost.")) return;
    startTransition(async () => {
      await resetWorkItemsAction();
      // Force a soft refresh to re-pull defaults
      window.location.reload();
    });
  };

  return (
    <AdminGate>
      <AdminLayout
        title="Work Manager"
        subtitle="Add, edit, reorder, hide, and feature the projects shown on the homepage gallery and at /work/[slug]."
      >
        {/* Toolbar */}
        <div className="sticky top-[78px] z-30 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-ink-0/90 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addNew}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-bone transition hover:border-electric/60 hover:text-electric"
            >
              <Plus className="h-3.5 w-3.5" />
              Add project
            </button>
            <button
              type="button"
              onClick={resetToDefaults}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-white/70 transition hover:border-white/30 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to defaults
            </button>
          </div>
          <div className="flex items-center gap-3">
            {toast && (
              <span
                className={cn(
                  "text-xs font-mono uppercase tracking-[0.16em]",
                  toast.ok ? "text-electric" : "text-red-400",
                )}
              >
                {toast.msg}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || pending}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-mono uppercase tracking-[0.16em] transition",
                dirty
                  ? "bg-electric text-white hover:-translate-y-px hover:shadow-[0_0_30px_rgba(0,82,255,0.4)]"
                  : "bg-white/8 text-white/40",
              )}
            >
              {pending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {dirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </div>

        {/* List */}
        <ul className="space-y-3">
          {items.map((it, i) => {
            const open = openSlug === it.slug;
            return (
              <li
                key={it.slug + i}
                className={cn(
                  "rounded-2xl border bg-ink-0 transition-colors",
                  it.visible === false
                    ? "border-white/8 opacity-60"
                    : "border-white/10 hover:border-white/25",
                  open && "border-electric/40",
                )}
              >
                {/* Row */}
                <div className="flex items-center gap-3 p-4 md:p-5">
                  {/* Index + reorder */}
                  <div className="flex shrink-0 flex-col">
                    <button
                      type="button"
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className={cn(
                        "grid h-6 w-7 place-items-center rounded text-white/50 transition hover:bg-white/[0.04] hover:text-white",
                        i === 0 && "pointer-events-none opacity-30",
                      )}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(i)}
                      disabled={i === items.length - 1}
                      aria-label="Move down"
                      className={cn(
                        "grid h-6 w-7 place-items-center rounded text-white/50 transition hover:bg-white/[0.04] hover:text-white",
                        i === items.length - 1 && "pointer-events-none opacity-30",
                      )}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Title block */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-bone">{it.client}</p>
                      <span className="rounded-full border border-electric/30 bg-electric/8 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-electric">
                        {it.label}
                      </span>
                      {it.featured && (
                        <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-electric">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-mute">
                      {it.slug} · /work/{it.slug}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`/work/${it.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open project page"
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleVisible(it.slug)}
                      title={it.visible === false ? "Show on site" : "Hide from site"}
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-full border transition",
                        it.visible === false
                          ? "border-white/10 text-white/50 hover:border-electric/40 hover:text-electric"
                          : "border-electric/30 bg-electric/8 text-electric",
                      )}
                    >
                      {it.visible === false ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(it.slug)}
                      title={it.featured ? "Unfeature" : "Mark as featured"}
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-full border transition",
                        it.featured
                          ? "border-electric/30 bg-electric/8 text-electric"
                          : "border-white/10 text-white/50 hover:border-white/30 hover:text-white",
                      )}
                    >
                      {it.featured ? (
                        <Star className="h-3.5 w-3.5" />
                      ) : (
                        <StarOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenSlug(open ? null : it.slug)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/65 transition hover:border-electric/40 hover:text-electric"
                      title={open ? "Close editor" : "Edit"}
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(it.slug)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/55 transition hover:border-red-500/40 hover:text-red-400"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Editor */}
                {open && (
                  <div className="border-t border-white/8 p-4 md:p-6">
                    <ItemEditor
                      item={it}
                      onChange={(patch) => updateItem(it.slug, patch)}
                      onSlugChange={(newSlug) => {
                        const clean = slugify(newSlug);
                        if (!clean || clean === it.slug) return;
                        if (items.some((x) => x.slug === clean)) {
                          window.alert(`Slug "${clean}" is already used.`);
                          return;
                        }
                        const idx = items.findIndex((x) => x.slug === it.slug);
                        const next = [...items];
                        next[idx] = { ...it, slug: clean };
                        mutate(next);
                        setOpenSlug(clean);
                      }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-mute">
            No projects yet. Click <span className="text-bone">Add project</span> above.
          </p>
        )}

        {/* Tips */}
        <section className="mt-12 rounded-2xl border border-white/8 bg-ink-0 p-6 text-sm text-mute">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            / Tip
          </p>
          <p className="mt-3 text-bone/85">
            After adding a new project, jump to{" "}
            <a href="/admin/dashboard/media" className="underline hover:text-electric">
              Media Library
            </a>{" "}
            and search for the project name. You'll see four upload slots:{" "}
            <span className="text-bone">thumbnail</span>,{" "}
            <span className="text-bone">hover video</span>,{" "}
            <span className="text-bone">desktop screenshot</span>, and{" "}
            <span className="text-bone">mobile screenshot</span>. Upload them and
            refresh the public site to see them live.
          </p>
        </section>
      </AdminLayout>
    </AdminGate>
  );
}

/* ---------- Editor ---------- */

function ItemEditor({
  item,
  onChange,
  onSlugChange,
}: {
  item: CaseStudy;
  onChange: (patch: Partial<CaseStudy>) => void;
  onSlugChange: (slug: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Field label="Project title">
        <input
          value={item.client}
          onChange={(e) => onChange({ client: e.target.value })}
          className="input"
          placeholder="Client Portal Dashboard"
        />
      </Field>

      <Field label="Slug (URL)">
        <div className="flex items-center gap-2 text-xs text-mute">
          <span className="font-mono">/work/</span>
          <input
            defaultValue={item.slug}
            onBlur={(e) => onSlugChange(e.target.value)}
            className="input flex-1"
            placeholder="client-portal"
          />
        </div>
      </Field>

      <Field label="Label">
        <div className="flex flex-wrap gap-1.5">
          {LABELS.map((L) => (
            <button
              key={L}
              type="button"
              onClick={() => onChange({ label: L })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                item.label === L
                  ? "border-electric bg-electric/15 text-electric"
                  : "border-white/10 text-white/70 hover:border-white/30 hover:text-white",
              )}
            >
              {L}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Year">
        <input
          value={item.year ?? ""}
          onChange={(e) => onChange({ year: e.target.value })}
          className="input"
          placeholder="2024"
        />
      </Field>

      <Field label="Industry / subtitle" full>
        <input
          value={item.industry}
          onChange={(e) => onChange({ industry: e.target.value })}
          className="input"
          placeholder="Concept · Local Service"
        />
      </Field>

      <Field label="Card headline" full>
        <input
          value={item.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          className="input"
          placeholder="A conversion-focused website for service businesses…"
        />
      </Field>

      <Field label="Card summary" full>
        <textarea
          value={item.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
          rows={2}
          className="input resize-none"
          placeholder="1–2 sentence summary shown on the homepage card and the work page hero."
        />
      </Field>

      <Field label="Full story (work page)" full>
        <textarea
          value={item.story}
          onChange={(e) => onChange({ story: e.target.value })}
          rows={4}
          className="input resize-none"
          placeholder="Long-form explanation of the build, decisions, and outcomes. Renders on /work/[slug]."
        />
      </Field>

      <Field label="Tags (comma-separated)" full>
        <input
          value={(item.tags ?? []).join(", ")}
          onChange={(e) =>
            onChange({
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 10),
            })
          }
          className="input"
          placeholder="Portal, Auth, Stripe, Dashboard"
        />
      </Field>

      <Field label="Tech stack (comma-separated)" full>
        <input
          value={item.stack.join(", ")}
          onChange={(e) =>
            onChange({
              stack: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 20),
            })
          }
          className="input"
          placeholder="Next.js 15, Supabase, Stripe, Resend"
        />
      </Field>

      <Field label="Duration label">
        <input
          value={item.duration}
          onChange={(e) => onChange({ duration: e.target.value })}
          className="input"
          placeholder="Internal build / Concept rebuild / 2 weeks"
        />
      </Field>

      <Field label="Live URL (optional)">
        <input
          value={item.liveUrl ?? ""}
          onChange={(e) => onChange({ liveUrl: e.target.value })}
          className="input"
          placeholder="https://client-site.com"
        />
      </Field>

      <Field label="GitHub URL (optional)">
        <input
          value={item.githubUrl ?? ""}
          onChange={(e) => onChange({ githubUrl: e.target.value })}
          className="input"
          placeholder="https://github.com/…"
        />
      </Field>

      <Field label="Accent color (hex, optional)">
        <input
          value={item.accentColor ?? ""}
          onChange={(e) => onChange({ accentColor: e.target.value })}
          className="input"
          placeholder="#0052ff"
        />
      </Field>

      {/* Metrics */}
      <div className="md:col-span-2">
        <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
          Metrics
        </p>
        <ul className="space-y-2">
          {item.metrics.map((m, i) => (
            <li key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input
                value={m.label}
                onChange={(e) => {
                  const next = [...item.metrics];
                  next[i] = { ...m, label: e.target.value };
                  onChange({ metrics: next });
                }}
                className="input"
                placeholder="Label"
              />
              <input
                value={m.value}
                onChange={(e) => {
                  const next = [...item.metrics];
                  next[i] = { ...m, value: e.target.value };
                  onChange({ metrics: next });
                }}
                className="input"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() =>
                  onChange({ metrics: item.metrics.filter((_, j) => j !== i) })
                }
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/55 transition hover:border-red-500/40 hover:text-red-400"
                aria-label="Remove metric"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            onChange({
              metrics: [...item.metrics, { label: "", value: "" }].slice(0, 8),
            })
          }
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-electric transition hover:text-bone"
        >
          <Plus className="h-3 w-3" />
          Add metric
        </button>
      </div>

      <Field label="Media note" full>
        <p className="rounded-lg border border-white/8 bg-white/[0.02] p-3 text-xs text-mute">
          Upload the project's media (thumbnail, hover video, desktop + mobile
          screenshots) from{" "}
          <a href="/admin/dashboard/media" className="text-electric hover:underline">
            Media Library
          </a>
          . Look for slots starting with <span className="text-bone">work-{item.slug}-</span>.
        </p>
      </Field>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          padding: 0.55rem 0.8rem;
          font-size: 0.875rem;
          color: #fff;
        }
        .input::placeholder { color: rgba(255,255,255,0.3); }
        .input:focus { outline: none; border-color: #0052ff; box-shadow: 0 0 0 3px rgba(0,82,255,0.18); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={cn("block", full && "md:col-span-2")}>
      <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
        {label}
      </span>
      {children}
    </label>
  );
}

void CheckCircle2;
