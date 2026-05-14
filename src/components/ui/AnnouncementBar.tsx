"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import { useAssets } from "@/components/providers/AssetProvider";
import { cn } from "@/lib/utils";

/**
 * AnnouncementBar
 *  • Fixed at top, h-9
 *  • Hides on scroll-down past 80px, reappears on scroll-up
 *  • Dismissible — choice persists via sessionStorage
 *  • Click "Download" → either downloads the uploaded teardown PDF or opens the lead modal
 *
 * When dismissed, the CSS var --announcement-h drops to 0 so all fixed headers
 * reflow to the top automatically.
 */
export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { open } = useLeadModal();
  const { getDocumentUrl } = useAssets();
  const pdfUrl = getDocumentUrl("teardown-pdf");

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem("weblogic.announcement") === "1") {
        setDismissed(true);
        document.documentElement.dataset.announcementDismissed = "true";
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.announcementDismissed = dismissed
      ? "true"
      : "false";
  }, [dismissed, mounted]);

  // Hide on scroll down, show on scroll up — with deadband to avoid jitter.
  useEffect(() => {
    if (!mounted || dismissed) return;
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY.current;
      if (Math.abs(diff) > 6) {
        if (diff > 0 && y > 80) {
          setHidden(true);
        } else if (diff < 0) {
          setHidden(false);
        }
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, dismissed]);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("weblogic.announcement", "1");
    } catch {}
  };

  if (!mounted || dismissed) return null;

  return (
    <motion.div
      role="region"
      aria-label="Announcement"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-[130] border-b border-white/8 bg-ink-0/95 backdrop-blur-md",
      )}
    >
      <div className="container-pad flex h-9 items-center justify-between gap-3 text-xs">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 rounded-full bg-electric px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.18em] text-white">
            Free
          </span>
          <span className="truncate text-bone/85">
            The Website Audit Checklist — 47 things every business site should get right.
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="group inline-flex items-center gap-1 text-electric transition hover:text-bone"
            >
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Get it</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => open("Announcement bar")}
              data-cursor="link"
              className="group inline-flex items-center gap-1 text-electric transition hover:text-bone"
            >
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Get it</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="grid h-5 w-5 place-items-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
