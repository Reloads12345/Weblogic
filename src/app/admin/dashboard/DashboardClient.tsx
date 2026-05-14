"use client";

import Link from "next/link";
import { ArrowUpRight, Box, FileText, Image as ImageIcon, Users } from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAssets } from "@/components/providers/AssetProvider";
import { UPLOAD_SLOTS, CASE_STUDIES } from "@/lib/data";

export default function DashboardClient() {
  const { assets } = useAssets();
  const totalAssets = Object.keys(assets).length;
  const totalSlots = UPLOAD_SLOTS.length;

  const cards = [
    {
      label: "Assets uploaded",
      value: `${totalAssets}`,
      sub: `of ${totalSlots} slots`,
      icon: ImageIcon,
      href: "/admin/dashboard/media",
    },
    {
      label: "Case studies",
      value: `${CASE_STUDIES.length}`,
      sub: "live on /case-studies",
      icon: FileText,
      href: "/admin/dashboard/cases",
    },
    {
      label: "Solution pages",
      value: "30+",
      sub: "in /solutions",
      icon: Box,
      href: "/#case-studies",
    },
    {
      label: "Active engagements",
      value: "47",
      sub: "across 12 countries",
      icon: Users,
      href: "/about",
    },
  ];

  return (
    <AdminGate>
      <AdminLayout
        title="Welcome back."
        subtitle="Manage uploads, content, and case studies for the WebLogic site."
      >
        {/* Stat cards */}
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.label}>
                <Link
                  href={c.href}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-white/8 bg-ink-50/40 p-6 transition hover:-translate-y-0.5 hover:border-electric/40"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-bone/80 transition group-hover:border-electric group-hover:text-electric">
                      <Icon className="h-4 w-4" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-mute transition group-hover:text-electric" />
                  </div>
                  <div className="mt-7">
                    <p className="font-display text-3xl tracking-tightest text-bone">
                      {c.value}
                    </p>
                    <p className="mt-1 text-sm text-bone/70">{c.label}</p>
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
                      {c.sub}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick actions */}
        <section className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Quick actions
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <Link
              href="/admin/dashboard/media"
              className="group flex items-center justify-between rounded-2xl border border-white/8 bg-ink-50/40 p-6 transition hover:border-electric/40"
            >
              <div>
                <p className="font-display text-xl tracking-tightest text-bone">
                  Upload your logo & videos
                </p>
                <p className="mt-1 text-sm text-mute">
                  Manage every asset on the site — logo, hero, expertise videos,
                  case-study photos, client logos.
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-mute transition group-hover:text-electric" />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="group flex items-center justify-between rounded-2xl border border-white/8 bg-ink-50/40 p-6 transition hover:border-electric/40"
            >
              <div>
                <p className="font-display text-xl tracking-tightest text-bone">
                  Preview live site
                </p>
                <p className="mt-1 text-sm text-mute">
                  Open the public WebLogic site in a new tab.
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-mute transition group-hover:text-electric" />
            </Link>
          </div>
        </section>
      </AdminLayout>
    </AdminGate>
  );
}
