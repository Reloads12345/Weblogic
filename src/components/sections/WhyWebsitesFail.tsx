import { AlertTriangle, Clock, Gauge, Smartphone, ShoppingCart, Search } from "lucide-react";

/**
 * Why Most Websites Fail — pain-agitate section, Server Component.
 *
 * Surfaces the real problems business owners feel, so they recognize
 * themselves in the symptoms and reach for the audit CTA right after.
 *
 * Was a client component purely for Framer Motion entrance staggers.
 * Now uses `.fade-up-on-mount` + `.fade-up-stagger` (defined in
 * globals.css) — CSS-only, zero hydration JS for this section.
 */
const FAILURES = [
  {
    icon: Gauge,
    title: "They're slow.",
    body:
      "4+ second loads. Visitors leave before the hero image renders. Conversions die before they start.",
  },
  {
    icon: Smartphone,
    title: "They break on mobile.",
    body:
      "Most traffic is mobile, but most small-business sites are still designed desktop-first. Forms misalign, buttons stack wrong, menus collapse oddly.",
  },
  {
    icon: ShoppingCart,
    title: "There's no clear next step.",
    body:
      "No primary CTA. Five competing buttons above the fold. Visitors scroll, get tired, and leave without booking, calling, or buying.",
  },
  {
    icon: Search,
    title: "Google can't read them.",
    body:
      "No structured data. Slow Core Web Vitals. Thin metadata. Rankings drop and the site stops bringing in free traffic.",
  },
  {
    icon: Clock,
    title: "They can't be updated.",
    body:
      "Every change requires the developer who built it three years ago. Marketing waits weeks for a price change or a new page.",
  },
  {
    icon: AlertTriangle,
    title: "They don't run anything.",
    body:
      "No payments. No booking. No client portal. The site is a brochure — visitors get a phone number and a contact form, and the rest is manual work.",
  },
];

export default function WhyWebsitesFail() {
  return (
    <section
      id="why-websites-fail"
      className="relative bg-ink-0 border-t border-white/5 py-24 md:py-32"
    >
      <div className="container-pad">
        <div className="fade-up-on-mount grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              / Why most websites fail
            </p>
            <h2 className="mt-6 max-w-[20ch] text-balance font-display text-display-lg leading-[0.95] tracking-tightest text-bone">
              Most websites sit online.{" "}
              <span className="text-mute">They don&apos;t move business.</span>
            </h2>
          </div>
          <p className="md:col-span-5 text-pretty text-mute md:text-lg">
            If your site does any of these six things, it&apos;s costing you customers
            you&apos;ll never see. The free audit catches them all.
          </p>
        </div>

        <ul className="fade-up-stagger mt-14 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {FAILURES.map((f) => {
            const Icon = f.icon;
            return (
              <li
                key={f.title}
                className="group rounded-2xl border border-white/8 bg-ink-0 p-7 transition-colors duration-500 hover:border-white/20"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-bone/80 transition-all duration-500 group-hover:border-electric/60 group-hover:text-electric">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-6 font-display text-xl leading-tight tracking-tightest text-bone md:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-2 text-pretty text-mute">{f.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
