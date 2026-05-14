"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, CreditCard, Globe2, LayoutDashboard, Workflow } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";

const SERVICES = [
  {
    icon: Globe2,
    title: "High-Performance Business Websites",
    subtitle: "From $750",
    body:
      "For businesses that need a fast, modern, conversion-focused website. Marketing pages, lead capture, mobile-first layout, SEO baseline, and a clean CMS to ship updates without a developer.",
    bullets: ["Up to 6 pages", "Custom design", "CMS + blog", "Analytics + SEO baseline"],
    accent: true,
  },
  {
    icon: LayoutDashboard,
    title: "Client Portals & Dashboards",
    subtitle: "From $1,500",
    body:
      "Authenticated portals for your clients — project status, approvals, file uploads, invoices, and customer accounts. Replaces an inbox-and-spreadsheet operation with a real product.",
    bullets: ["Role-based auth", "File uploads", "Invoice + Stripe status", "Admin panel"],
  },
  {
    icon: CreditCard,
    title: "Payment & Booking Systems",
    subtitle: "From $800",
    body:
      "Stripe-powered checkouts, deposit + milestone billing, subscriptions, custom booking flows. Wire it to your calendar, your CRM, and your email — fully automated.",
    bullets: ["Stripe Checkout / Connect", "Deposit + balance flows", "Booking + reminders", "Webhook automation"],
  },
  {
    icon: Workflow,
    title: "Automation & Internal Tools",
    subtitle: "From $800",
    body:
      "Admin dashboards, email automation, CRM workflows, lead routing, and internal ops tools. Replaces a stack of Zaps with one clean system you actually own.",
    bullets: ["Admin dashboards", "Email automation", "Lead routing", "CRM sync"],
  },
  {
    icon: Code2,
    title: "Maintenance & Growth Plans",
    subtitle: "From $75 / month",
    body:
      "Hosting, monitoring, updates, SEO, analytics reports, and priority support. Your site stops being a one-time project and becomes a system that keeps compounding.",
    bullets: ["Hosting + uptime monitoring", "Security + updates", "Monthly SEO + analytics", "Priority support"],
  },
];

export default function Services() {
  const { open } = useLeadModal();

  return (
    <section
      id="services"
      className="relative bg-ink-0 border-t border-white/5 py-24 md:py-32"
    >
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid items-end gap-8 md:grid-cols-12"
        >
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / What WebLogic builds
            </p>
            <h2 className="mt-6 max-w-[18ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
              Real services.{" "}
              <span className="text-mute">Transparent pricing.</span>
            </h2>
          </div>
          <p className="md:col-span-5 text-pretty text-mute md:text-lg">
            Five core services that cover everything from a clean marketing site to
            a full client portal with payments, automations, and ongoing maintenance.
          </p>
        </motion.div>

        {/* Service cards */}
        <ul className="mt-16 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex flex-col rounded-2xl border bg-ink-0 p-7 transition-all duration-500 hover:-translate-y-0.5 md:p-8 ${
                  s.accent
                    ? "border-electric/40 lg:col-span-2 hover:border-electric"
                    : "border-white/8 hover:border-white/25"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-bone/80 transition-all duration-500 group-hover:border-electric/60 group-hover:text-electric">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                    {s.subtitle}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl leading-tight tracking-tightest text-bone md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-pretty text-mute md:text-base">{s.body}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-white/8 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-white/55"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => open(`Services · ${s.title}`)}
                  className="mt-7 inline-flex items-center gap-1.5 self-start text-xs font-mono uppercase tracking-[0.22em] text-mute transition-colors hover:text-electric"
                >
                  Get a quote
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </motion.li>
            );
          })}
        </ul>

        {/* Bottom rail */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-ink-0 p-6 md:p-7">
          <div>
            <p className="font-display text-lg tracking-tight text-bone md:text-xl">
              Not sure what you need?
            </p>
            <p className="mt-1 text-sm text-mute">
              Send us your site and a few sentences about your business. We'll
              reply within 24 hours with a written plan and a fixed quote.
            </p>
          </div>
          <MagneticButton
            variant="electric"
            cursorMode="cta"
            onClick={() => open("Services · audit")}
            className="!px-6 !py-3 text-sm"
          >
            Book a Free Audit
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
