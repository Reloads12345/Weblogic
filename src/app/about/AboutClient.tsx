"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Header from "@/components/nav/Header";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import ClientLogos from "@/components/sections/ClientLogos";
import Manifesto from "@/components/sections/Manifesto";
import FounderQuote from "@/components/sections/FounderQuote";
import Footer from "@/components/sections/Footer";
import { useAssets } from "@/components/providers/AssetProvider";
import { BRAND } from "@/lib/data";

const ROADMAP = [
  {
    when: "2024",
    title: "WebLogic Studio is founded.",
    body:
      "After years engineering composable platforms, Caleb Gathu founds WebLogic Studio with one thesis: small businesses deserve real software, not template-driven brochure sites.",
    metric: "1 founder · 1 thesis",
  },
  {
    when: "2024 · H2",
    title: "First production builds ship.",
    body:
      "Internal client portal, Stripe deposit + invoice flow, performance landing-page demo, and a service-business concept rebuild — all built to production standards and used internally.",
    metric: "5 builds · 0 fluff",
  },
  {
    when: "2025",
    title: "Maintenance & Care plans go live.",
    body:
      "WebLogic Care launches — recurring hosting, monitoring, monthly SEO + analytics reports, and priority support. Every build becomes a long-term system, not a one-time project.",
    metric: "From $75/month",
  },
  {
    when: "Today",
    title: "Now accepting U.S. projects.",
    body:
      "Currently taking on select website, client portal, checkout, and automation builds for U.S.-based service businesses, startups, and creators. Free 24-hour audits available.",
    metric: "Founding-client pricing",
  },
];

const VALUES = [
  {
    title: "Real software, not templates.",
    body: "Every build uses the same stack that runs serious SaaS apps — type-safe, auth-ready, payment-ready. No drag-and-drop shortcuts.",
  },
  {
    title: "Fixed quotes, not hourly billing.",
    body: "Every project ships on a written fixed quote. You know the price before you say yes. No scope creep, no surprise invoices.",
  },
  {
    title: "Direct access, no agency layers.",
    body: "You talk to the person building your site. No account manager handoff, no slide-deck stalling. Decisions get made the same day.",
  },
];

export default function AboutClient() {
  const { open: openLead } = useLeadModal();
  const { getImageUrl } = useAssets();
  const teamLeftUrl = getImageUrl("about-team-left");
  const teamRightUrl = getImageUrl("about-team-right");
  const founderPhoto = getImageUrl("founder-photo");

  return (
    <>
      <Header />
      <main className="bg-ink-0">
        {/* Hero */}
        <section className="bg-ink-0 pt-32 md:pt-40 pb-20 md:pb-24">
          <div className="container-pad max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute"
            >
              / About WebLogic
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[20ch] text-balance font-display text-display-xl leading-[0.9] tracking-tightest text-bone"
            >
              A U.S.-based remote{" "}
              <span className="text-mute">web development studio.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-3xl text-pretty text-mute md:text-xl"
            >
              WebLogic builds high-performance websites, client portals, payment
              systems, and automations for service businesses, startups, creators,
              and growing online brands. No agency bloat. No fake offices. No
              hourly billing surprises.
            </motion.p>
          </div>
        </section>

        {/* Trust marquee */}
        <ClientLogos />

        {/* Roadmap */}
        <section className="border-t border-white/5 py-24 md:py-32">
          <div className="container-pad">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">/ Roadmap</p>
              <h2 className="mt-5 max-w-[18ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
                From founding to <span className="text-mute">accepting clients.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-pretty text-mute md:text-lg">
                A short, honest timeline. No invented enterprise milestones — just
                what WebLogic has actually built and where it's headed.
              </p>
            </motion.div>

            <ol className="mt-16 relative">
              <span aria-hidden className="absolute left-3 top-2 bottom-2 w-px bg-white/10 md:left-1/2" />
              {ROADMAP.map((item, i) => (
                <motion.li
                  key={item.when}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative grid grid-cols-1 gap-4 pl-10 pb-12 md:grid-cols-2 md:gap-12 md:pl-0 ${
                    i % 2 === 0 ? "md:[&>*:first-child]:text-right" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute left-2 top-2 h-3 w-3 rounded-full bg-electric shadow-[0_0_14px_rgba(0,82,255,0.7)] md:left-1/2 md:-translate-x-1/2"
                  />
                  <div className={i % 2 === 0 ? "md:pr-12" : "md:pl-12"}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">{item.when}</p>
                    <h3 className="mt-2 font-display text-2xl leading-tight tracking-tightest text-bone md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">{item.metric}</p>
                  </div>
                  <div className={i % 2 === 0 ? "md:pl-12" : "md:pr-12"}>
                    <p className="text-pretty text-mute md:text-lg">{item.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Built remotely / nationwide */}
        <section className="border-t border-white/5 py-24 md:py-32">
          <div className="container-pad max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">/ How we work</p>
            <h2 className="mt-5 max-w-[18ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
              Built remotely.{" "}
              <span className="text-mute">Delivered nationwide.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-mute md:text-lg">
              WebLogic operates as a remote-first studio out of the United States.
              No physical office overhead in your invoice. No outsourced offshore
              team you've never met. Just clean, fast communication from kickoff
              to launch — and beyond.
            </p>
          </div>
        </section>

        {/* Manifesto */}
        <Manifesto />

        {/* Two-column statement */}
        <section className="border-t border-white/5 py-24 md:py-32">
          <div className="container-pad">
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[22ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone md:text-display-xl"
            >
              Real software{" "}
              <span className="text-mute">for real businesses.</span>
            </motion.h2>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-3xl border border-white/8 bg-ink-0"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {teamLeftUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={teamLeftUrl} alt="WebLogic build" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <AbstractStack />
                  )}
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl tracking-tightest text-bone">
                    Websites built to grow with your business.
                  </h3>
                  <p className="mt-3 text-pretty text-mute">
                    Modern frameworks, type-safe code, payment-ready infrastructure.
                    Every build can scale into a portal, dashboard, automation, or
                    full business system when you need it.
                  </p>
                  <button
                    type="button"
                    onClick={() => openLead("About · Composable")}
                    className="btn-electric mt-5 text-xs"
                  >
                    Book a Free Audit
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-3xl border border-white/8 bg-ink-0"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {teamRightUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={teamRightUrl} alt="WebLogic studio" className="absolute inset-0 h-full w-full object-cover" />
                  ) : founderPhoto ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={founderPhoto} alt="Caleb Gathu" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <FounderVisual />
                  )}
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl tracking-tightest text-bone">
                    Built by the founder.
                  </h3>
                  <p className="mt-3 text-pretty text-mute">
                    Caleb personally architects and ships every WebLogic
                    engagement. Direct access from kickoff to launch. Remote ·
                    United States.
                  </p>
                  <Link
                    href="/pricing"
                    className="btn-ghost mt-5 inline-flex items-center gap-2 text-xs"
                    data-cursor="link"
                  >
                    See pricing
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-white/5 py-24 md:py-32">
          <div className="container-pad">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">/ Values</p>
            <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">What we stand on.</h2>

            <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
              {VALUES.map((v, i) => (
                <motion.li
                  key={v.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: i * 0.06 }}
                  className="rounded-2xl border border-white/8 bg-ink-0 p-7 transition hover:border-white/20"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-2xl leading-tight tracking-tightest text-bone">{v.title}</h3>
                  <p className="mt-3 text-pretty text-mute">{v.body}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Founder quote */}
        <FounderQuote />

        {/* CTA */}
        <section className="border-t border-white/5 py-20 md:py-28">
          <div className="container-pad text-center">
            <h2 className="mx-auto max-w-[20ch] text-balance font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              Have a project? Let's scope it.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-mute md:text-lg">
              Send your site (or a sentence about your business). You'll get a
              written plan and a fixed quote within 24 hours — no obligation.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                variant="electric"
                cursorMode="cta"
                onClick={() => openLead("About CTA")}
                className="!px-7 !py-3.5"
              >
                Book a Free Audit
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-7 py-3.5 text-sm text-bone transition-all duration-300 hover:border-white/30"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

/* Decorative placeholders */
function AbstractStack() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink-100/40">
      <div className="relative h-2/3 w-2/3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-x-0 rounded-2xl border border-electric/30 bg-electric/5"
            style={{
              height: "22%",
              top: `${i * 22}%`,
              transform: `translateX(${i % 2 === 0 ? -10 : 10}px)`,
              boxShadow: "0 12px 40px rgba(0,82,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FounderVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink-100/40">
      <div className="grid h-32 w-32 place-items-center rounded-full border border-white/12 bg-gradient-to-br from-electric/20 to-transparent">
        <span className="font-display text-3xl tracking-tightest text-bone/70">CG</span>
      </div>
    </div>
  );
}

// Touch BRAND so the unused-import lint stays quiet if the section copy uses it later.
void BRAND;
