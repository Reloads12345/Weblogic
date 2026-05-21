"use client";

import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Loader2,
  Mail,
  PauseCircle,
  ArrowUpRight,
  Video,
  FileCode,
  Palette,
  File,
} from "lucide-react";
import type { ClientProject, MilestoneStatus } from "@/lib/client-portal";
import Logo from "@/components/ui/Logo";
import { BRAND } from "@/lib/data";
import { cn } from "@/lib/utils";

type IconCmp = React.ComponentType<{ className?: string }>;

const STATUS_COPY: Record<MilestoneStatus, { label: string; icon: IconCmp; color: string }> = {
  complete: { label: "Done", icon: CheckCircle2, color: "text-electric" },
  "in-progress": { label: "In progress", icon: Loader2, color: "text-bone" },
  upcoming: { label: "Upcoming", icon: Circle, color: "text-mute" },
  blocked: { label: "Needs review", icon: PauseCircle, color: "text-amber-300" },
};

const FILE_ICONS: Record<string, IconCmp> = {
  doc: FileText,
  video: Video,
  design: Palette,
  code: FileCode,
  other: File,
};

interface Props {
  project: ClientProject;
  isDemo: boolean;
}

/**
 * Premium client-facing portal. Shows project status, milestones, file
 * deliveries, recent activity, and self-serve actions (billing portal,
 * book a check-in, email the studio).
 *
 * No global Header/Footer chrome — the portal feels like its own
 * surface, separate from the marketing site. The brand mark is
 * deliberately small in the corner so the project takes the spotlight.
 */
export default function PortalClient({ project, isDemo }: Props) {
  const done = project.milestones.filter((m) => m.status === "complete").length;
  const total = project.milestones.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <main
      id="main"
      className="relative min-h-screen bg-ink-0 text-bone"
    >
      {/* Top bar */}
      <header className="border-b border-white/8">
        <div className="container-pad flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href="/" aria-label="WebLogic — home">
            <Logo size="md" className="!h-8 !max-w-[140px]" />
          </Link>
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
            <span className="hidden sm:inline">Project portal</span>
            {isDemo && (
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-amber-300">
                Demo view
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero — project summary */}
      <section className="border-b border-white/5 py-12 md:py-16">
        <div className="container-pad mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            / {project.company}
          </p>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
            {project.projectName}
          </h1>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-0 px-4 py-1.5 text-sm text-bone/85">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            {project.statusLine}
          </p>

          {/* Progress bar */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Milestones
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                <span className="text-bone">{done}</span> / {total}
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-electric transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Self-serve actions */}
          <div className="mt-9 flex flex-wrap gap-2">
            {project.calLink && (
              <a
                href={
                  project.calLink.startsWith("http")
                    ? project.calLink
                    : `https://cal.com/${project.calLink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-xs font-medium text-ink-0 transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,82,255,0.4)]"
              >
                <Calendar className="h-3.5 w-3.5" />
                Book a check-in
              </a>
            )}
            {project.billingPortalUrl && (
              <a
                href={project.billingPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-xs text-bone transition hover:border-white/35"
              >
                Manage billing
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            <a
              href={`mailto:${project.contactEmail}?subject=${encodeURIComponent(
                `[${project.company}] ${project.projectName}`,
              )}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-xs text-bone transition hover:border-white/35"
            >
              <Mail className="h-3.5 w-3.5" />
              Email the studio
            </a>
          </div>
        </div>
      </section>

      {/* Two-column body */}
      <section className="container-pad mx-auto max-w-5xl py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Milestones */}
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / Phase by phase
            </p>
            <h2 className="mt-4 font-display text-2xl tracking-tightest md:text-3xl">
              Where we are.
            </h2>

            <ol className="mt-8 relative">
              <span
                aria-hidden
                className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10"
              />
              {project.milestones.map((m, i) => {
                const { label, icon: Icon, color } = STATUS_COPY[m.status];
                return (
                  <li
                    key={`${m.title}-${i}`}
                    className="relative flex gap-5 pb-7 last:pb-0"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "relative z-10 mt-1.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border-2 bg-ink-0",
                        m.status === "complete" &&
                          "border-electric shadow-[0_0_12px_rgba(0,82,255,0.6)]",
                        m.status === "in-progress" &&
                          "border-bone shadow-[0_0_12px_rgba(255,255,255,0.4)]",
                        m.status === "upcoming" && "border-white/25",
                        m.status === "blocked" && "border-amber-300",
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-display text-lg tracking-tight md:text-xl">
                          {m.title}
                        </p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]",
                            color,
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-3 w-3",
                              m.status === "in-progress" && "animate-spin",
                            )}
                          />
                          {label}
                        </span>
                      </div>
                      {m.due && (
                        <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                          <Clock className="h-3 w-3" />
                          {m.due}
                        </p>
                      )}
                      {m.description && (
                        <p className="mt-3 text-pretty text-sm text-mute md:text-base">
                          {m.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Sidebar: recent activity + files */}
          <aside className="space-y-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Recent activity
              </p>
              {project.recentActivity.length === 0 ? (
                <p className="mt-4 text-sm text-mute">
                  No activity yet. New updates will show up here.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {project.recentActivity.slice(0, 8).map((a, i) => (
                    <li
                      key={`${a.at}-${i}`}
                      className="rounded-2xl border border-white/8 bg-ink-50/40 p-4"
                    >
                      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-mute">
                        {a.at} · {a.kind}
                      </p>
                      <p className="mt-2 text-sm text-bone/90">{a.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Files &amp; deliveries
              </p>
              {project.files.length === 0 ? (
                <p className="mt-4 text-sm text-mute">
                  Nothing shared yet. Deliverables show up here as the
                  project moves forward.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {project.files.map((f, i) => {
                    const Icon = FILE_ICONS[f.kind] ?? File;
                    return (
                      <li key={`${f.label}-${i}`}>
                        <a
                          href={f.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-ink-50/40 p-4 transition hover:border-electric/40 hover:bg-ink-50"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-ink-0 text-mute transition group-hover:border-electric/40 group-hover:text-electric">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1 truncate text-sm text-bone">
                            {f.label}
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-mute transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-white/8 py-8">
        <div className="container-pad mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-mute md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {BRAND.name} · Project portal
          </p>
          <p>
            Bookmark this URL — it&apos;s your private link to{" "}
            <span className="text-bone">{project.projectName}</span>.
          </p>
        </div>
      </footer>
    </main>
  );
}
