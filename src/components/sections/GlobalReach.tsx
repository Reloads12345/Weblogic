"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Flag, MessageSquare, Rocket, Users } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";

/**
 * "Built remotely. Delivered nationwide."
 *
 * Replaces the previous Global Reach / globe section. WebLogic operates as a
 * U.S.-based remote studio — not a global enterprise agency. This block is the
 * honest version of that positioning.
 */
const CARDS = [
  {
    icon: Flag,
    title: "U.S.-based remote studio",
    body: "We operate remotely and support businesses across the United States. No agency office overhead in your invoice.",
  },
  {
    icon: MessageSquare,
    title: "Fast communication",
    body: "Clear updates, async check-ins, a shared project dashboard, and direct communication from kickoff through launch.",
  },
  {
    icon: Users,
    title: "Built for serious small businesses",
    body: "Ideal for service businesses, startups, creators, local companies, and brands that need more than a basic website.",
  },
  {
    icon: Rocket,
    title: "Now accepting projects",
    body: "Currently taking on select website, portal, checkout, and automation builds. Free 24-hour audits available.",
  },
];

export default function GlobalReach() {
  const { open: openLead } = useLeadModal();

  return (
    <section
      id="global-reach"
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
              / How we work
            </p>
            <h2 className="mt-6 max-w-[18ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
              Built remotely.{" "}
              <span className="text-mute">Delivered nationwide.</span>
            </h2>
          </div>
          <p className="md:col-span-5 text-pretty text-mute md:text-lg">
            WebLogic works with U.S.-based businesses that need high-performance
            websites, client portals, checkout flows, automations, and long-term
            support — without agency bloat.
          </p>
        </motion.div>

        {/* Cards */}
        <ul className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.li
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col rounded-2xl border border-white/8 bg-ink-0 p-7 transition-colors duration-500 hover:border-white/20"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-bone/80 transition-all duration-500 group-hover:border-electric/60 group-hover:text-electric">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-6 font-display text-xl leading-tight tracking-tightest text-bone md:text-2xl">
                  {c.title}
                </h3>
                <p className="mt-2 text-pretty text-mute">{c.body}</p>
              </motion.li>
            );
          })}
        </ul>

        {/* Inline CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-ink-0 p-6 md:p-7">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
              Now accepting U.S. projects
            </p>
            <p className="mt-2 font-display text-xl tracking-tight text-bone md:text-2xl">
              Ready to scope a real build?
            </p>
          </div>
          <MagneticButton
            variant="electric"
            cursorMode="cta"
            onClick={() => openLead("Built remotely · CTA")}
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
