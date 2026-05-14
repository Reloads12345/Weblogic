"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { NAV } from "@/lib/data";
import type { NavItem } from "@/types";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import MegaMenu from "@/components/nav/MegaMenu";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";
import { useLeadModal } from "@/components/ui/LeadModalProvider";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<NavItem | null>(null);
  const closeTimer = useRef<number | null>(null);
  const lastY = useRef(0);
  const { play } = useSound();
  const { open: openLead } = useLeadModal();

  // Hide-on-scroll-down, show-on-scroll-up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY.current;
      // ignore tiny jitter
      if (Math.abs(diff) > 6) {
        // hide when scrolling DOWN past 120px
        if (diff > 0 && y > 120) {
          setHidden(true);
          setActiveMega(null); // close mega menu when hiding
        } else if (diff < 0) {
          setHidden(false);
        }
        lastY.current = y;
      }
      setScrolled(y > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const enterMega = (item: NavItem) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (item.mega) {
      setActiveMega(item);
      play("hover");
    } else {
      setActiveMega(null);
    }
  };
  const leaveMega = () => {
    closeTimer.current = window.setTimeout(() => setActiveMega(null), 120);
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ top: "var(--announcement-h, 0px)" }}
        className={cn(
          "fixed inset-x-0 z-[120] transition-[backdrop-filter,background-color,border-color] duration-500",
          scrolled
            ? "border-b border-white/5 bg-ink-0/72 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
        onMouseLeave={leaveMega}
      >
        <div className="container-pad relative flex h-[80px] items-center justify-between gap-4 md:h-[88px] md:gap-6">
          {/* Left: small logo lockup */}
          <Link
            href="/"
            className="relative flex items-center"
            aria-label="WebLogic — home"
          >
            <Logo size="md" />
          </Link>

          {/* Center: nav */}
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => enterMega(item)}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    data-cursor="link"
                    className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-bone/80 transition hover:text-bone"
                    onClick={() => setActiveMega(null)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    data-cursor="link"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm transition",
                      activeMega?.label === item.label
                        ? "text-bone"
                        : "text-bone/80 hover:text-bone",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        activeMega?.label === item.label && "rotate-180",
                      )}
                    />
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Right: tight-timeline indicator + CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#mid-cta"
              data-cursor="link"
              className="hidden items-center gap-2 text-xs italic text-bone/85 transition-colors hover:text-bone md:inline-flex"
            >
              <motion.span
                className="relative inline-flex h-2 w-2"
                aria-hidden
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric shadow-[0_0_10px_rgba(0,82,255,0.9)]" />
              </motion.span>
              Got a tight timeline?
            </a>

            <MagneticButton
              variant="electric"
              cursorMode="cta"
              onClick={() => openLead("Header · Free Audit")}
              className="!px-5 !py-2.5 text-xs font-medium tracking-tight md:!px-6 md:!py-3 md:text-sm"
            >
              Book a Free Audit
            </MagneticButton>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <MegaMenu
            open={!!activeMega}
            item={activeMega}
            onLinkClick={() => setActiveMega(null)}
            topOffset={124}
          />
        </div>
      </motion.header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[140] flex flex-col bg-ink-0/95 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <Logo size="md" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-full border border-white/10 p-2"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-5">
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-white/5 py-4">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-2xl tracking-tightest text-bone"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <p className="font-display text-2xl tracking-tightest text-bone">
                    {item.label}
                  </p>
                )}
                {item.mega && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {item.mega.flatMap((col) =>
                      col.links.slice(0, 3).map((l) => (
                        <Link
                          key={l.label}
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-sm text-mute hover:text-bone"
                        >
                          {l.label}
                        </Link>
                      )),
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="space-y-3 border-t border-white/10 p-5">
            <a
              href="#mid-cta"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm italic text-bone"
            >
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
              </span>
              Got a tight timeline?
            </a>
            <MagneticButton
              variant="electric"
              cursorMode="cta"
              onClick={() => {
                setMobileOpen(false);
                openLead("Mobile drawer · Free Audit");
              }}
              className="w-full"
            >
              Book a Free Audit
            </MagneticButton>
          </div>
        </div>
      )}
    </>
  );
}
