"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { LegalDoc } from "@/lib/legal";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import Logo from "@/components/ui/Logo";
import { BRAND } from "@/lib/data";

interface Props {
  data: LegalDoc;
}

export default function LegalPage({ data }: Props) {
  const { open: openLead } = useLeadModal();

  return (
    <>
      {/* Slim header */}
      <header
        style={{ top: "var(--announcement-h, 0px)" }}
        className="fixed inset-x-0 z-[100] border-b border-white/8 bg-ink-0/80 backdrop-blur-xl"
      >
        <div className="container-pad flex h-[88px] items-center justify-between gap-4 md:h-[96px] md:gap-6">
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

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2"
            aria-label="WebLogic — home"
          >
            <Logo size="md" />
          </Link>

          <MagneticButton
            variant="electric"
            cursorMode="cta"
            onClick={() => openLead(`Legal · ${data.title}`)}
            className="!px-5 !py-2.5 text-xs"
          >
            Book a Free Audit
          </MagneticButton>
        </div>
      </header>

      <main className="bg-ink-0 pt-[88px] md:pt-[96px]">
        {/* Title */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad max-w-3xl">
            {data.effective && (
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                {data.effective}
              </p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-display text-display-lg leading-[0.95] tracking-tightest text-bone md:text-display-xl"
            >
              {data.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-pretty text-mute md:text-xl"
            >
              {data.subtitle}
            </motion.p>
          </div>
        </section>

        {/* Sections */}
        <section className="py-16 md:py-20">
          <div className="container-pad max-w-3xl">
            <ol className="space-y-12">
              {data.sections.map((s, i) => (
                <motion.li
                  key={s.heading}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-white/8 pt-8"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                    0{i + 1}
                  </p>
                  <h2 className="mt-3 font-display text-2xl leading-tight tracking-tightest text-bone md:text-3xl">
                    {s.heading}
                  </h2>
                  <div className="mt-5 space-y-4 text-pretty text-bone/85 md:text-lg">
                    {s.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/8 py-16 md:py-20">
          <div className="container-pad text-center">
            <h2 className="mx-auto max-w-[20ch] text-balance font-display text-display-md tracking-tightest text-bone">
              Questions about this policy?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-mute">
              Email{" "}
              <a
                href={`mailto:${BRAND.email}`}
                className="text-bone underline-offset-4 transition-colors hover:text-electric hover:underline"
              >
                {BRAND.email}
              </a>{" "}
              — we respond within five business days.
            </p>
            <div className="mt-8 inline-flex items-center gap-3">
              <MagneticButton
                variant="electric"
                cursorMode="cta"
                onClick={() => openLead(`Legal · ${data.title}`)}
                className="!px-6 !py-3"
              >
                Book a Free Audit
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm text-bone transition-all duration-300 hover:border-white/30 hover:bg-white/[0.03]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/8 py-8">
          <div className="container-pad flex flex-col items-start justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-mute md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} {BRAND.name} Studio. All rights reserved.</p>
            <ul className="flex flex-wrap gap-4">
              <li><Link href="/privacy" className="transition-colors hover:text-bone">Privacy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-bone">Terms</Link></li>
              <li><Link href="/security" className="transition-colors hover:text-bone">Security</Link></li>
              <li><Link href="/accessibility" className="transition-colors hover:text-bone">Accessibility</Link></li>
              <li><Link href="/press-kit" className="transition-colors hover:text-bone">Press kit</Link></li>
            </ul>
            <p>Built remotely · United States</p>
          </div>
        </footer>
      </main>
    </>
  );
}
