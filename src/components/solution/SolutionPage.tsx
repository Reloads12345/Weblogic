"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Solution } from "@/lib/solutions";
import { CASE_STUDIES } from "@/lib/data";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import Logo from "@/components/ui/Logo";
import { BRAND } from "@/lib/data";

const GROUP_LABEL: Record<string, string> = {
  design: "Design",
  development: "Development",
  seo: "SEO & Performance",
  scope: "Scope",
  cms: "By CMS",
  industry: "Industry",
  "use-case": "Use Case",
  stage: "Stage",
  framework: "Framework",
  cloud: "Cloud Platform",
};

export default function SolutionPage({ data }: { data: Solution }) {
  const { open: openLead } = useLeadModal();
  const related = data.related
    .map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
    .filter((c): c is (typeof CASE_STUDIES)[number] => Boolean(c));

  return (
    <>
      {/* Slim header */}
      <header
        style={{ top: "var(--announcement-h, 0px)" }}
        className="fixed inset-x-0 z-[100] border-b border-white/8 bg-ink-0/80 backdrop-blur-xl"
      >
        <div className="container-pad flex h-[64px] items-center justify-between gap-4 md:h-[72px] md:gap-6">
          <Link
            href="/"
            data-cursor="link"
            className="group inline-flex items-center gap-2.5 text-sm text-bone/85 transition-colors hover:text-bone"
            aria-label="Back to home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:border-white/30">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="text-sm text-mute transition-colors group-hover:text-bone">
              Back
            </span>
          </Link>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="WebLogic — home">
            <Logo size="md" />
          </Link>
          <MagneticButton
            variant="electric"
            cursorMode="cta"
            onClick={() => openLead(`Solution · ${data.label}`)}
            className="!px-5 !py-2.5 text-xs"
          >
            Book a Free Audit
          </MagneticButton>
        </div>
      </header>

      <main className="bg-ink-0 pt-[64px] md:pt-[72px]">
        {/* Hero */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute"
            >
              / {GROUP_LABEL[data.group] ?? data.group} · {data.label}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[22ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone md:text-display-xl"
            >
              {data.hero}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-3xl text-pretty text-mute md:text-xl"
            >
              {data.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8"
            >
              {data.metrics.map((m) => (
                <div key={m.label} className="bg-ink-0 p-5">
                  <p className="font-display text-2xl tracking-tightest text-bone md:text-3xl">{m.value}</p>
                  <p className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-mute">{m.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pillars */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">/ How we approach it</p>
            <h2 className="mt-5 max-w-[22ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              Three disciplines inside the discipline.
            </h2>

            <ul className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-3">
              {data.pillars.map((p, i) => (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-white/8 bg-ink-0 p-7 transition-colors duration-500 hover:border-white/20"
                >
                  <h3 className="font-display text-2xl leading-tight tracking-tightest text-bone">{p.title}</h3>
                  <p className="mt-3 text-pretty text-mute">{p.copy}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Process */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">/ Our process</p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">How we run it.</h2>
            </div>
            <ol className="md:col-span-8">
              {data.process.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-5 border-t border-white/8 py-6 first:border-t-0"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">0{i + 1}</span>
                  <p className="flex-1 text-pretty text-bone/85 md:text-lg">{line}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Stack */}
        <section className="border-b border-white/5 py-20">
          <div className="container-pad">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">/ Stack</p>
            <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">What we ship on.</h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {data.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-bone/85 transition hover:border-electric/50 hover:text-electric"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related case studies */}
        {related.length > 0 && (
          <section className="border-b border-white/5 py-20 md:py-28">
            <div className="container-pad">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">/ Where this showed up</p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">Selected work</h2>
              <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
                {related.map((cs) => (
                  <li
                    key={cs.slug}
                    className="group flex flex-col rounded-2xl border border-white/8 bg-ink-0 p-6 transition-colors duration-500 hover:border-white/25"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                        {cs.industry.split("·")[0].trim()}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">{cs.duration}</span>
                    </div>
                    <p className="mt-6 font-display text-3xl tracking-tightest text-bone">{cs.client}</p>
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
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad text-center">
            <h2 className="mx-auto max-w-[18ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              Bring this discipline to your stack.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-mute md:text-lg">
              A senior partner replies inside one business day.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                variant="electric"
                cursorMode="cta"
                onClick={() => openLead(`Solution · ${data.label}`)}
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
        <footer className="py-10">
          <div className="container-pad flex flex-col items-start justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-mute md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} {BRAND.name} Studio. All rights reserved.</p>
            <p>Built remotely · United States</p>
          </div>
        </footer>
      </main>
    </>
  );
}
