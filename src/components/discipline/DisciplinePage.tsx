"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Discipline } from "@/lib/disciplines";
import { CASE_STUDIES } from "@/lib/data";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import Logo from "@/components/ui/Logo";

interface Props {
  data: Discipline;
}

export default function DisciplinePage({ data }: Props) {
  const { open: openLead } = useLeadModal();
  const related = data.related
    .map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
    .filter((c): c is (typeof CASE_STUDIES)[number] => Boolean(c));

  return (
    <>
      {/* Header bar — slim on mobile, slightly taller on desktop for the huge logo */}
      <header
        style={{ top: "var(--announcement-h, 0px)" }}
        className="fixed inset-x-0 z-[100] border-b border-white/8 bg-ink-0/80 backdrop-blur-xl"
      >
        <div className="container-pad flex h-[100px] md:h-[140px] lg:h-[180px] items-center justify-between gap-4 md:gap-6">
          <Link
            href="/"
            data-cursor="link"
            className="group inline-flex items-center gap-2.5 text-sm text-bone/85 transition-colors hover:text-bone"
            aria-label="Back to home"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/12 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:border-white/30">
              <ArrowLeft className="h-5 w-5" />
            </span>
            <span className="text-sm text-mute transition-colors group-hover:text-bone">
              Back
            </span>
          </Link>

          <Link
            href="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center"
            aria-label="WebLogic — home"
          >
            <Logo size="huge" />
          </Link>

          <MagneticButton
            variant="electric"
            cursorMode="cta"
            onClick={() => openLead(`Discipline · ${data.title}`)}
            className="!px-5 !py-2.5 text-xs"
          >
            Book a Free Audit
          </MagneticButton>
        </div>
      </header>

      <main className="bg-ink-0 pt-[100px] md:pt-[140px] lg:pt-[180px]">
        {/* Hero */}
        <section className="relative bg-ink-0 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="container-pad">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute"
            >
              {data.number} / Discipline
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[18ch] font-display text-display-xl leading-[0.92] tracking-tightest text-bone"
            >
              {data.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-2xl text-pretty text-mute md:text-xl"
            >
              {data.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 max-w-2xl"
            >
              {data.metrics.map((m) => (
                <div key={m.label} className="bg-ink-0 p-5">
                  <p className="font-display text-2xl tracking-tightest text-bone md:text-3xl">
                    {m.value}
                  </p>
                  <p className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
                    {m.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Intro */}
        <section className="border-t border-white/5 py-20">
          <div className="container-pad max-w-3xl">
            <p className="text-pretty text-bone/85 md:text-xl md:leading-snug">
              {data.intro}
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="border-t border-white/5 py-20 md:py-28">
          <div className="container-pad">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / What we do
            </p>
            <h2 className="mt-5 max-w-[20ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              Four disciplines inside the discipline.
            </h2>

            <ul className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-2">
              {data.pillars.map((p, i) => (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-white/8 bg-ink-0 p-7 transition-colors duration-500 hover:border-white/20"
                >
                  <h3 className="font-display text-2xl leading-tight tracking-tightest text-bone">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-pretty text-mute">{p.copy}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Approach */}
        <section className="border-t border-white/5 py-20 md:py-28">
          <div className="container-pad grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Our approach
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                How we run it.
              </h2>
            </div>
            <ol className="md:col-span-8">
              {data.approach.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-5 border-t border-white/8 py-6 first:border-t-0"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                    0{i + 1}
                  </span>
                  <p className="flex-1 text-pretty text-bone/85 md:text-lg">{line}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Deliverables */}
        <section className="border-t border-white/5 py-20 md:py-28">
          <div className="container-pad grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / What you get
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                Deliverables, not slideware.
              </h2>
              <p className="mt-5 max-w-md text-mute">
                Every engagement leaves your team with a working platform — code,
                schemas, runbooks. No black-box hand-offs.
              </p>
            </div>
            <ul className="md:col-span-7 space-y-3">
              {data.deliverables.map((d, i) => (
                <motion.li
                  key={d}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: 0.05 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-ink-0 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric" />
                  <span className="text-pretty text-bone/85">{d}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related case studies */}
        {related.length > 0 && (
          <section className="border-t border-white/5 py-20 md:py-28">
            <div className="container-pad">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / Related work
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                Where this discipline showed up.
              </h2>

              <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
                {related.map((cs) => (
                  <li
                    key={cs.slug}
                    className="group flex flex-col rounded-2xl border border-white/8 bg-ink-0 p-6 transition-colors duration-500 hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                        {cs.industry.split("·")[0].trim()}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                        {cs.duration}
                      </span>
                    </div>
                    <p className="mt-6 font-display text-3xl tracking-tightest text-bone">
                      {cs.client}
                    </p>
                    <p className="mt-3 text-sm text-mute">{cs.summary}</p>
                    <Link
                      href="/#case-studies"
                      data-cursor="link"
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.22em] text-bone transition-colors hover:text-electric"
                    >
                      Read the case study
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border-t border-white/5 py-20 md:py-28">
          <div className="container-pad text-center">
            <h2 className="mx-auto max-w-[18ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              Bring this discipline to your stack.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-mute md:text-lg">
              A senior partner replies inside one business day — and a free
              composable audit lands in your inbox the next.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                variant="electric"
                cursorMode="cta"
                onClick={() => openLead(`Discipline · ${data.title}`)}
                className="!px-7 !py-3.5"
              >
                Book a Free Audit
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <Link
                href="/"
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-7 py-3.5 text-sm text-bone transition-all duration-300 hover:border-white/30 hover:bg-white/[0.03]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </div>
        </section>

        {/* Mini footer */}
        <footer className="border-t border-white/8 py-10">
          <div className="container-pad flex flex-col items-start justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-mute md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} WebLogic Studio</p>
            <p className="flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
              </span>
              All systems operational
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
