"use client";

import Link from "next/link";
import AdminGate from "@/components/admin/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { CASE_STUDIES } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Page() {
  return (
    <AdminGate>
      <AdminLayout
        title="Case Studies"
        subtitle={`${CASE_STUDIES.length} live · client work surfaced on the homepage carousel.`}
      >
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {CASE_STUDIES.map((cs) => (
            <li
              key={cs.slug}
              className="group flex flex-col rounded-2xl border border-white/8 bg-ink-50/40 p-6 transition hover:border-electric/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  {cs.industry.split("·")[0].trim()}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  {cs.duration}
                </span>
              </div>
              <p className="mt-5 font-display text-2xl tracking-tightest text-bone">
                {cs.client}
              </p>
              <p className="mt-2 text-sm text-mute">{cs.summary}</p>
              <Link
                href={`/admin/dashboard/media`}
                className="mt-5 inline-flex items-center gap-1.5 self-start text-xs font-mono uppercase tracking-[0.22em] text-bone/80 transition hover:text-electric"
              >
                Manage assets
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </li>
          ))}
        </ul>
      </AdminLayout>
    </AdminGate>
  );
}
