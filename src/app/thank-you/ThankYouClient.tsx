"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { BRAND } from "@/lib/data";

/* ──────────────────────────────────────────────────────────────
   The thank-you page renders different copy depending on what
   the user just bought. The mode is passed in the URL by either:
     • the lead-form Server Action (no `type` param)
     • the Stripe success_url for project deposits/audits/custom
       deposits / subscriptions

   ?type=project        → standard build deposit (Starter/Growth)
   ?type=audit          → paid audit
   ?type=custom         → custom project deposit
   ?type=subscription   → care-plan subscription
   (no `type`)          → lead-form submission (existing default)
   ────────────────────────────────────────────────────────────── */

type FlowType =
  | "project"
  | "audit"
  | "custom"
  | "subscription"
  | "lead-checkout-fallback"
  | "lead";

interface FlowCopy {
  eyebrow: string;
  headline: React.ReactNode;
  subhead: string;
  stepsHeading: string;
  steps: Array<{ icon: React.ComponentType<{ className?: string }>; n: string; title: string; body: string; when: string }>;
  cta?: { label: string; href: string };
}

function copyFor(type: FlowType): FlowCopy {
  switch (type) {
    case "project":
      return {
        eyebrow: "Deposit received",
        headline: (
          <>
            Deposit received.{" "}
            <span className="text-mute">Your project slot is secured.</span>
          </>
        ),
        subhead:
          "WebLogic begins planning and design now. Watch your inbox for kickoff details and the project intake form.",
        stepsHeading: "What happens next",
        steps: [
          {
            icon: FileText,
            n: "01",
            title: "Complete the client intake form",
            body: "We send a short intake covering brand, content, accounts, and access. Reply within 1 business day to keep the timeline locked.",
            when: "Right after this page",
          },
          {
            icon: MessageSquare,
            n: "02",
            title: "Kickoff email + Slack channel",
            body: "Caleb reviews your details, sends a project kickoff email, and opens a Slack (or Email thread) for daily updates.",
            when: "Within 24 hours",
          },
          {
            icon: Clock,
            n: "03",
            title: "Remaining balance due before launch",
            body: "Final invoice arrives once the build is staged and approved. Paid before domain connection + final handoff.",
            when: "At launch",
          },
        ],
        cta: { label: "Return home", href: "/" },
      };
    case "audit":
      return {
        eyebrow: "Audit received",
        headline: (
          <>
            Your paid audit is{" "}
            <span className="text-mute">in the queue.</span>
          </>
        ),
        subhead:
          "WebLogic reviews your website end-to-end and sends a written audit with prioritized fixes within 48 hours.",
        stepsHeading: "How the audit ships",
        steps: [
          {
            icon: FileText,
            n: "01",
            title: "Confirm your URL + business details",
            body: "If we don't have your site URL yet, reply to the receipt email so we can start.",
            when: "Now",
          },
          {
            icon: MessageSquare,
            n: "02",
            title: "WebLogic reviews the site",
            body: "Design, mobile, speed, SEO, conversion flow, trust signals — each scored with a fix priority.",
            when: "Within 48 hours",
          },
          {
            icon: Clock,
            n: "03",
            title: "Written audit + action plan",
            body: "Plain-English PDF delivered to your inbox. Optional 15-min call if you want help interpreting it.",
            when: "Email + optional call",
          },
        ],
        cta: { label: "Return home", href: "/" },
      };
    case "custom":
      return {
        eyebrow: "Custom deposit received",
        headline: (
          <>
            Deposit received.{" "}
            <span className="text-mute">Scoping begins now.</span>
          </>
        ),
        subhead:
          "WebLogic reviews your project details and sends a written proposal with a fixed remaining balance.",
        stepsHeading: "Next steps",
        steps: [
          {
            icon: FileText,
            n: "01",
            title: "Scope discovery",
            body: "Caleb reviews everything you've sent so far and lists open questions for a 15-min discovery call.",
            when: "Within 24 hours",
          },
          {
            icon: MessageSquare,
            n: "02",
            title: "Written proposal + fixed quote",
            body: "Scope, timeline, deliverables, and a fixed remaining balance — emailed back to you.",
            when: "Within 3 business days",
          },
          {
            icon: Clock,
            n: "03",
            title: "Approval + kickoff",
            body: "Once you approve the proposal, the remaining balance is invoiced and design + development begin.",
            when: "After approval",
          },
        ],
        cta: { label: "Return home", href: "/" },
      };
    case "lead-checkout-fallback":
      return {
        eyebrow: "Details received",
        headline: (
          <>
            Got your details.{" "}
            <span className="text-mute">Caleb will follow up shortly.</span>
          </>
        ),
        subhead:
          "Our payment system hit a snag for this configuration, but we have everything we need to finish it manually. Expect an email from caleb@weblogic.digital within one business day with a secure payment link.",
        stepsHeading: "What happens next",
        steps: [
          {
            icon: MessageSquare,
            n: "01",
            title: "Caleb reviews your selection",
            body: "Your package, add-ons, and contact details landed in our inbox. We confirm the scope and write back today or tomorrow.",
            when: "Within 24 hours",
          },
          {
            icon: FileText,
            n: "02",
            title: "Secure payment link sent",
            body: "We email a personal Stripe payment link for your deposit — same secure flow, just hand-checked.",
            when: "Same email thread",
          },
          {
            icon: Clock,
            n: "03",
            title: "Project kickoff",
            body: "Once the deposit clears, planning + design start the next business day.",
            when: "After payment",
          },
        ],
        cta: { label: "Return home", href: "/" },
      };
    case "subscription":
      return {
        eyebrow: "Care plan active",
        headline: (
          <>
            Your monthly care plan{" "}
            <span className="text-mute">is active.</span>
          </>
        ),
        subhead:
          "Monthly support starts now. WebLogic reviews your site, confirms support routes, and begins monitoring.",
        stepsHeading: "What happens next",
        steps: [
          {
            icon: FileText,
            n: "01",
            title: "Initial site review",
            body: "Caleb runs a baseline review of your site or system so monthly checks have a known starting point.",
            when: "Within 48 hours",
          },
          {
            icon: MessageSquare,
            n: "02",
            title: "Support process confirmed",
            body: "You get a single contact email + Slack thread (if you want one) for support requests. Response SLA depends on the plan.",
            when: "Same week",
          },
          {
            icon: Clock,
            n: "03",
            title: "Ongoing monitoring + monthly report",
            body: "Uptime, security, performance, analytics — all tracked. Monthly summary lands in your inbox.",
            when: "Monthly",
          },
        ],
        cta: { label: "Return home", href: "/" },
      };
    case "lead":
    default:
      return {
        eyebrow: "Submission received",
        headline: (
          <>
            Got it.<br />
            <span className="text-mute">Your audit's already started.</span>
          </>
        ),
        subhead:
          "A senior partner is reviewing your submission now. Expect a written audit and a fixed quote in your inbox within one business day.",
        stepsHeading: "What happens next",
        steps: [
          {
            icon: FileText,
            n: "01",
            title: "We review your site",
            body: "Within 24 hours. Performance, mobile, SEO baseline, conversion paths, structure — the full audit.",
            when: "Within 24 hours",
          },
          {
            icon: MessageSquare,
            n: "02",
            title: "You get a written plan + fixed quote",
            body: "Plain English, ranked recommendations, and a fixed price for the work — sent to your inbox.",
            when: "Same email thread",
          },
          {
            icon: Clock,
            n: "03",
            title: "Optional 15-min call",
            body: "If there's a clear fit, we hop on a quick call to align on scope, timeline, and kickoff. No high-pressure sales.",
            when: "Only if you want",
          },
        ],
      };
  }
}

export default function ThankYouClient() {
  const params = useSearchParams();
  const rawType = params.get("type");
  const type: FlowType =
    rawType === "project" ||
    rawType === "audit" ||
    rawType === "custom" ||
    rawType === "subscription" ||
    rawType === "lead-checkout-fallback"
      ? rawType
      : "lead";

  const copy = copyFor(type);

  return (
    <>
      {/* Slim header */}
      <header
        style={{ top: "var(--announcement-h, 0px)" }}
        className="fixed inset-x-0 z-[100] border-b border-white/8 bg-ink-0/80 backdrop-blur-xl"
      >
        <div className="container-pad flex h-[80px] items-center justify-between gap-4 md:h-[88px]">
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
              Back to site
            </span>
          </Link>
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2"
            aria-label="WebLogic — home"
          >
            <Logo size="md" />
          </Link>
          <span className="hidden text-[10px] font-mono uppercase tracking-[0.22em] text-mute md:inline-flex">
            {copy.eyebrow}
          </span>
        </div>
      </header>

      <main id="main" className="bg-ink-0 pt-[80px] md:pt-[88px]">
        {/* Hero — confirmation */}
        <section className="border-b border-white/5 py-24 md:py-32">
          <div className="container-pad max-w-3xl text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-electric/40 bg-electric/10 text-electric shadow-glow-md"
            >
              <CheckCircle2 className="h-7 w-7" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-7 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-electric"
            >
              <span className="relative inline-flex h-2 w-2" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
              </span>
              {copy.eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 font-display text-display-xl leading-[0.92] tracking-tightest text-bone"
            >
              {copy.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-pretty text-mute md:text-xl"
            >
              {copy.subhead}
            </motion.p>
          </div>
        </section>

        {/* Steps */}
        <section className="border-b border-white/5 py-20 md:py-28">
          <div className="container-pad">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / {copy.stepsHeading}
            </p>
            <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone md:text-display-lg">
              Three steps. No surprises.
            </h2>

            <ol className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-3">
              {copy.steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.li
                    key={s.n}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col rounded-2xl border border-white/8 bg-ink-0 p-7 transition hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                        {s.n}
                      </span>
                      <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-bone/80">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <h3 className="mt-7 font-display text-xl leading-tight tracking-tightest text-bone md:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-pretty text-mute">{s.body}</p>
                    <p className="mt-auto pt-6 text-[10px] font-mono uppercase tracking-[0.22em] text-electric">
                      {s.when}
                    </p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Resource links — only on lead-form thank-you */}
        {type === "lead" && (
          <section className="border-b border-white/5 py-20 md:py-28">
            <div className="container-pad max-w-3xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / While you wait
              </p>
              <h2 className="mt-5 font-display text-display-md tracking-tightest text-bone">
                A few things to explore.
              </h2>

              <ul className="mt-10 space-y-3">
                <ResourceLink
                  href="/pricing"
                  title="View pricing & checkout"
                  description="Configure a build, pay your 50% deposit, and lock in your start date."
                />
                <ResourceLink
                  href="/#case-studies"
                  title="Selected builds"
                  description="Internal demos, concept rebuilds, and performance teardowns."
                />
                <ResourceLink
                  href="/about"
                  title="About WebLogic"
                  description="Built remote-first by a small team of senior engineers and designers."
                />
                <ResourceLink
                  href="/#process"
                  title="The WebLogic Growth System"
                  description="Strategy → Build → Launch → Maintain."
                />
              </ul>
            </div>
          </section>
        )}

        {/* Urgent path */}
        <section className="border-b border-white/5 py-16 md:py-20">
          <div className="container-pad max-w-3xl text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / Need anything sooner?
            </p>
            <h2 className="mt-4 font-display text-display-md tracking-tightest text-bone">
              Reply with{" "}
              <span className="text-electric">"priority"</span>{" "}
              in the subject.
            </h2>
            <p className="mt-3 text-mute">
              Caleb monitors{" "}
              <span className="text-bone">{BRAND.email}</span> during business
              hours and responds same-day to priority threads.
            </p>
            <a
              href={`mailto:${BRAND.email}?subject=Priority`}
              data-cursor="link"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/8 px-6 py-3 text-sm text-electric transition hover:border-electric hover:bg-electric/15"
            >
              Email {BRAND.email}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* CTA back to site */}
        {copy.cta && (
          <section className="py-16">
            <div className="container-pad text-center">
              <Link
                href={copy.cta.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-7 py-3.5 text-sm text-bone transition-all duration-300 hover:border-white/30"
              >
                <ArrowLeft className="h-4 w-4" />
                {copy.cta.label}
              </Link>
            </div>
          </section>
        )}

        {/* Mini footer */}
        <footer className="py-10">
          <div className="container-pad flex flex-col items-start justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-mute md:flex-row md:items-center">
            <p>
              © {new Date().getFullYear()} {BRAND.name} Studio. All rights
              reserved.
            </p>
            <p>Built remotely · United States</p>
          </div>
        </footer>
      </main>
    </>
  );
}

function ResourceLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <li>
      <Link
        href={href}
        data-cursor="link"
        className="group flex items-center justify-between gap-6 rounded-2xl border border-white/8 bg-ink-0 p-5 transition hover:-translate-y-0.5 hover:border-electric/40"
      >
        <div>
          <p className="font-display text-lg tracking-tight text-bone group-hover:text-electric">
            {title}
          </p>
          <p className="mt-1 text-sm text-mute">{description}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 text-mute transition group-hover:text-electric" />
      </Link>
    </li>
  );
}
