"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FAQ } from "@/lib/data";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/components/ui/LeadModalProvider";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { open: openLead } = useLeadModal();

  return (
    <section
      id="faq"
      className="relative bg-ink-0 border-t border-white/5 py-24 md:py-32"
    >
      <div className="container-pad grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow">/ FAQ</p>
          <h2 className="section-h mt-4 max-w-[14ch] text-balance">
            Answers, before you have to ask.
          </h2>
          <p className="mt-5 text-mute">
            Six things every prospective partner asks us. If yours isn't here, the answer is yes — let's get on a call.
          </p>
          <div className="mt-8">
            <MagneticButton
              variant="electric"
              cursorMode="cta"
              onClick={() => openLead("FAQ block")}
            >
              Book a Free Audit
            </MagneticButton>
          </div>
        </div>

        <ul className="md:col-span-8">
          {FAQ.map((item, i) => {
            const open = openIdx === i;
            return (
              <li
                key={item.q}
                className={cn(
                  "border-t border-white/8 last:border-b transition-colors duration-300",
                  open && "bg-white/[0.02]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  aria-expanded={open}
                >
                  <span className="flex flex-1 items-baseline gap-4">
                    <span className="w-8 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl tracking-tight text-bone md:text-2xl">
                      {item.q}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-500",
                      open
                        ? "rotate-45 border-electric bg-electric/10 text-electric"
                        : "border-white/15 text-white/60",
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="ml-12 max-w-2xl pb-6 text-pretty text-mute md:text-lg">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
