/**
 * FounderQuote — Server Component.
 *
 * Was a client component purely because of a single `motion.figure`
 * `whileInView` entrance. Swapped to `.fade-up-on-mount` (defined in
 * globals.css), which runs at first paint. Since this section sits late
 * in the homepage, the animation has long since completed by the time
 * the user scrolls down — visually identical, zero hydration cost.
 */
export default function FounderQuote() {
  return (
    <section
      aria-label="Founder quote"
      className="relative bg-ink-0 border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-pad">
        <figure className="fade-up-on-mount mx-auto max-w-4xl text-center">
          <span
            aria-hidden
            className="font-display text-7xl leading-none text-electric/60 md:text-8xl"
          >
            &ldquo;
          </span>
          <blockquote className="mt-2 text-balance font-display text-3xl leading-[1.2] tracking-tightest text-bone md:text-5xl">
            We don&apos;t ship projects. <br className="hidden md:block" />
            <span className="text-mute">We build systems that compound.</span>
          </blockquote>
          <figcaption className="mt-10 inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink-0 text-xs font-mono uppercase tracking-widest text-bone">
              CG
            </span>
            <span className="text-left">
              <span className="block text-sm text-bone">Caleb Gathu</span>
              <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-mute">
                Founder · WebLogic Studio
              </span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
