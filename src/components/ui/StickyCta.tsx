"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import { cn } from "@/lib/utils";

/**
 * Sticky floating CTA — bottom-center on desktop, hidden on mobile.
 * Appears after scrolling past hero (~720px), hides when within ~520px of footer.
 *
 *   ⬤ Got a tight timeline?  →  Talk to an Expert
 *
 * The user can dismiss it with the X — choice persists for the session.
 */
export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { open } = useLeadModal();

  useEffect(() => {
    try {
      if (sessionStorage.getItem("weblogic.stickyCta") === "dismissed") {
        setDismissed(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const onScroll = () => {
      const y = window.scrollY;
      const passedHero = y > 720;
      const doc = document.documentElement;
      const distToBottom = doc.scrollHeight - (y + window.innerHeight);
      const nearFooter = distToBottom < 520;
      setVisible(passedHero && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("weblogic.stickyCta", "dismissed");
    } catch {}
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          className={cn(
            "fixed inset-x-0 bottom-5 z-[130] hidden justify-center px-5 lg:flex",
          )}
        >
          <div className="relative flex items-center gap-3 rounded-full border border-white/10 bg-ink-100/95 px-2 py-2 pl-4 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
            <span className="relative inline-flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-electric/50 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric shadow-[0_0_10px_rgba(0,82,255,0.85)]" />
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-bone">
              Free audit · 24-hour reply{" "}
              <span className="text-mute">no obligation</span>
            </span>
            <span className="h-3 w-px bg-white/15" aria-hidden />
            <button
              type="button"
              onClick={() => open("Sticky CTA · Free Audit")}
              data-cursor="cta"
              className="inline-flex items-center gap-1.5 rounded-full bg-electric px-4 py-2 text-xs font-medium text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_0_30px_rgba(0,82,255,0.45)]"
            >
              Book a Free Audit
              <ArrowUpRight className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="ml-1 grid h-7 w-7 place-items-center rounded-full border border-white/10 text-white/50 transition hover:border-white/30 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
