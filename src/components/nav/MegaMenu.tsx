"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { NavItem } from "@/types";
import { ArrowUpRight } from "lucide-react";

interface Props {
  open: boolean;
  item: NavItem | null;
  onLinkClick?: () => void;
  topOffset?: number;
}

/**
 * MegaMenu — fixed, viewport-centered, portaled to document.body so no
 * `overflow: hidden` ancestor or transformed ancestor can clip it.
 *
 * Bug-fix note: the OUTER wrapper handles fixed positioning + centering
 * (translate-x-1/2). The INNER motion.div only animates opacity + y, so
 * Framer Motion's transform never clobbers the centering transform.
 */
export default function MegaMenu({
  open,
  item,
  onLinkClick,
  topOffset = 104,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Pure-hash anchors → smooth scroll. Anything else (real route) → let Next/Link navigate.
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", href);
      }
    }
    onLinkClick?.();
  };

  const content = (
    <AnimatePresence>
      {open && item?.mega && (
        <div
          className="fixed left-1/2 z-[200] w-[min(92vw,1180px)] -translate-x-1/2"
          style={{ top: topOffset }}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong overflow-hidden rounded-3xl shadow-2xl shadow-black/60"
          >
            <div className="grid grid-cols-12 gap-x-5 gap-y-8 p-6 md:p-8">
              {/* 5 nav columns */}
              {item.mega.map((col) => (
                <div key={col.heading} className="col-span-6 sm:col-span-4 lg:col-span-2">
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                    / {col.heading}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={(e) => handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, link.href)}
                          className="group flex items-start gap-1.5 transition-all duration-300 hover:translate-x-0.5"
                          data-cursor="link"
                        >
                          <span className="flex flex-1 flex-col">
                            <span className="flex items-center gap-1.5 text-sm font-medium leading-tight text-bone group-hover:text-electric">
                              {link.label}
                              {link.badge && (
                                <span className="rounded-full bg-electric/20 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest text-electric">
                                  {link.badge}
                                </span>
                              )}
                            </span>
                            {link.description && (
                              <span className="mt-1 text-xs leading-snug text-mute">
                                {link.description}
                              </span>
                            )}
                          </span>
                          <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-mute opacity-0 transition-opacity duration-300 group-hover:text-electric group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* 6th cell — feature card */}
              {item.feature && (
                <Link
                  href={item.feature.href}
                  onClick={(e) => handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, item.feature!.href)}
                  data-cursor="link"
                  className="group col-span-12 sm:col-span-8 lg:col-span-2 flex flex-col justify-between rounded-2xl border border-white/10 bg-ink-0 p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-electric/40 hover:bg-white/[0.02]"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      {item.feature.eyebrow}
                    </p>
                    <p className="mt-2 text-pretty font-display text-base leading-snug tracking-tight text-bone">
                      {item.feature.title}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.18em] text-electric">
                    {item.feature.copy}
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/8 bg-ink-100/30 px-6 py-3 text-[10px] font-mono uppercase tracking-[0.18em] text-mute md:px-8">
              <span>WebLogic · Composable web engineering</span>
              <span className="flex items-center gap-2">
                <span className="relative inline-flex h-2 w-2" aria-hidden>
                  <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
                </span>
                Now accepting U.S. projects
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Portal to document.body — escapes any overflow:hidden / transformed ancestor.
  if (!mounted) return null;
  return createPortal(content, document.body);
}
