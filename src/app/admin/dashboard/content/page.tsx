"use client";

import AdminGate from "@/components/admin/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { BRAND, IMPACT } from "@/lib/data";

export default function Page() {
  return (
    <AdminGate>
      <AdminLayout
        title="Homepage Content"
        subtitle="Headline copy and live impact metrics. (Read-only preview — wire to Storyblok / Sanity to enable inline editing.)"
      >
        <section className="rounded-2xl border border-white/8 bg-ink-50/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Brand
          </p>
          <h2 className="mt-3 font-display text-xl tracking-tight text-bone">
            {BRAND.name}
          </h2>
          <p className="mt-2 text-sm text-mute">{BRAND.tagline}</p>
          <p className="mt-1 text-xs text-mute/80">{BRAND.supporting}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-white/8 bg-ink-50/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Impact metrics
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {IMPACT.map((m) => (
              <li
                key={m.label}
                className="rounded-xl border border-white/10 bg-ink-0 p-4"
              >
                <p className="font-display text-2xl tracking-tightest text-bone">
                  {m.prefix ?? ""}
                  {m.value.toLocaleString()}
                  {m.suffix ?? ""}
                </p>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                  {m.label}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-sm text-mute">
          To make these editable from the admin, swap{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-bone">
            src/lib/data.ts
          </code>{" "}
          for a Storyblok or Sanity client. Content schemas already match.
        </p>
      </AdminLayout>
    </AdminGate>
  );
}
