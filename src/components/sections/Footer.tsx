"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import RemoteCoverageGlobe from "@/components/globe/RemoteCoverageGlobe";
import MagneticButton from "@/components/ui/MagneticButton";
import SocialIcon from "@/components/ui/SocialIcon";
import { useLeadModal } from "@/components/ui/LeadModalProvider";
import { BRAND, NAV, SOCIAL_LINKS } from "@/lib/data";

export default function Footer() {
  const { open: openLead } = useLeadModal();
  return (
    <footer
      id="footer"
      className="relative bg-ink-0 border-t border-white/10 pt-24 md:pt-32"
    >
      {/* Final CTA */}
      <div className="container-pad grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
            <span className="relative inline-flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            Studio open
          </p>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-display-lg leading-[0.93] tracking-tightest text-bone">
            Websites & systems that{" "}
            <span className="text-electric">evolve with your business.</span>
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-mute md:text-lg">
            Send your site and a sentence about your business. You'll get a written
            plan and a fixed quote within 24 hours — no obligation.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <MagneticButton
              variant="electric"
              cursorMode="cta"
              onClick={() => openLead("Footer · Free Audit")}
              className="!px-7 !py-3.5"
            >
              Book a Free Audit
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <a
              href={`mailto:${BRAND.email}`}
              className="btn-ghost text-sm"
              data-cursor="link"
            >
              <Mail className="h-3.5 w-3.5" />
              {BRAND.email}
            </a>
          </div>

          {/* Visible, clickable contact emails — primary + support */}
          <div className="mt-8 flex flex-col gap-1.5 text-sm">
            <a
              href={`mailto:${BRAND.email}`}
              data-cursor="link"
              className="group inline-flex w-fit items-center gap-2 text-bone/85 transition-colors hover:text-electric"
            >
              <Mail className="h-3.5 w-3.5 text-mute group-hover:text-electric" />
              {BRAND.email}
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
                · projects
              </span>
            </a>
            <a
              href={`mailto:${BRAND.supportEmail}`}
              data-cursor="link"
              className="group inline-flex w-fit items-center gap-2 text-bone/85 transition-colors hover:text-electric"
            >
              <Mail className="h-3.5 w-3.5 text-mute group-hover:text-electric" />
              {BRAND.supportEmail}
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-mute">
                · support
              </span>
            </a>
          </div>
        </div>

        {/* Remote U.S. coverage globe — dark cinematic Earth with U.S. city
            labels. Component lazy-mounts on scroll-into-view; respects
            prefers-reduced-motion; has its own pause button + honesty note. */}
        <div className="relative md:col-span-5">
          <RemoteCoverageGlobe />
        </div>
      </div>

      {/* Newsletter band removed — no content cadence yet. Add back when there's
          a real publishing plan. The component below is preserved but unused. */}

      {/* Mega-link grid mirroring nav */}
      <div className="container-pad mt-16 grid grid-cols-2 gap-8 border-t border-white/8 pt-12 md:grid-cols-6">
        {NAV.find((n) => n.label === "Solutions")?.mega?.map((col) => (
          <div key={col.heading}>
            <p className="eyebrow mb-3">{col.heading}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-mute transition-colors hover:text-bone"
                    data-cursor="link"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Studio column */}
        <div>
          <p className="eyebrow mb-3">Studio</p>
          <ul className="space-y-2 text-sm text-mute">
            <li><a href="/#case-studies" className="hover:text-bone">Work</a></li>
            <li><a href="/#insights" className="hover:text-bone">Insights</a></li>
            <li><a href="/#testimonials" className="hover:text-bone">Testimonials</a></li>
            <li><a href="/press-kit" className="hover:text-bone">Press kit</a></li>
          </ul>
        </div>
      </div>

      {/* Social row — GitHub (placeholder), LinkedIn, X, TikTok, Instagram.
          Real-URL links open in a new tab with `noopener noreferrer`.
          Placeholders (e.g. GitHub before the org is live) render as
          inert <span> so we never ship broken links to public traffic. */}
      <div className="container-pad mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
        <ul className="flex flex-wrap items-center gap-2.5">
          {SOCIAL_LINKS.map((s) => {
            const base =
              "grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/65 transition-all duration-300";
            const interactive =
              "hover:-translate-y-0.5 hover:border-electric/60 hover:text-electric hover:shadow-[0_0_0_4px_rgba(0,82,255,0.08)]";
            const placeholderStyle =
              "cursor-default opacity-50 hover:translate-y-0 hover:border-white/10 hover:text-white/65 hover:shadow-none";

            if (s.placeholder) {
              return (
                <li key={s.key}>
                  <span
                    role="link"
                    aria-disabled="true"
                    aria-label={s.label}
                    title={s.label}
                    className={`${base} ${placeholderStyle}`}
                  >
                    <SocialIcon social={s} className="h-4 w-4" />
                  </span>
                </li>
              );
            }

            return (
              <li key={s.key}>
                <a
                  href={s.href}
                  aria-label={`${s.label} (opens in a new tab)`}
                  title={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className={`${base} ${interactive}`}
                >
                  <SocialIcon social={s} className="h-4 w-4" />
                </a>
              </li>
            );
          })}
        </ul>
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
          Built remotely · United States
        </p>
      </div>

      {/* Wordmark band */}
      <div className="relative mt-12 overflow-hidden border-t border-white/8 py-12">
        <Logo size="xl" />
        <p
          aria-hidden
          className="container-pad mt-4 select-none font-display leading-[0.85] tracking-tightest text-bone/[0.04]"
          style={{ fontSize: "clamp(5rem, 18vw, 22rem)" }}
        >
          WebLogic
        </p>
      </div>

      {/* Sub-footer */}
      <div className="container-pad flex flex-col items-start justify-between gap-4 border-t border-white/8 py-6 text-[10px] font-mono uppercase tracking-[0.18em] text-mute md:flex-row md:items-center">
        <p>
          © {new Date().getFullYear()} {BRAND.name} Studio. All rights reserved.
        </p>
        <ul className="flex flex-wrap gap-4">
          <li><a href="/privacy" className="transition-colors hover:text-bone">Privacy</a></li>
          <li><a href="/terms" className="transition-colors hover:text-bone">Terms</a></li>
          <li><a href="/security" className="transition-colors hover:text-bone">Security</a></li>
          <li><a href="/accessibility" className="transition-colors hover:text-bone">Accessibility</a></li>
          <li><a href="/press-kit" className="transition-colors hover:text-bone">Press kit</a></li>
        </ul>
        <p className="flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2" aria-hidden>
            <span className="absolute inset-0 rounded-full bg-electric/55 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
          </span>
          All systems operational
        </p>
      </div>
    </footer>
  );
}

