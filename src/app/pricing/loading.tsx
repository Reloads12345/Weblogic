/**
 * Loading skeleton for /pricing.
 * Renders instantly during navigation so the page never flashes blank
 * while the (mostly static) marketing payload streams in.
 */
export default function Loading() {
  return (
    <main className="bg-ink-0 pt-[80px] md:pt-[88px]">
      {/* Header skeleton */}
      <div
        style={{ top: "var(--announcement-h, 0px)" }}
        className="fixed inset-x-0 z-[100] border-b border-white/8 bg-ink-0/80 backdrop-blur-xl"
      >
        <div className="container-pad flex h-[80px] items-center justify-between gap-4 md:h-[88px]">
          <div className="h-7 w-[120px] rounded bg-white/[0.05] md:h-9 md:w-[160px]" />
          <div className="absolute left-1/2 h-8 w-44 -translate-x-1/2 rounded-full bg-white/[0.04] md:h-10 md:w-56" />
          <div className="h-9 w-32 rounded-full bg-white/[0.04]" />
        </div>
      </div>

      {/* Hero skeleton */}
      <section className="border-b border-white/5 py-20 md:py-28">
        <div className="container-pad space-y-6">
          <div className="h-3 w-32 rounded bg-white/[0.06]" />
          <div className="h-12 w-3/4 rounded-lg bg-white/[0.05] md:h-20 md:w-2/3" />
          <div className="h-5 w-2/3 rounded bg-white/[0.04]" />
        </div>
      </section>

      {/* Pricing cards skeleton — 3 tiers */}
      <section className="border-b border-white/5 py-16 md:py-24">
        <div className="container-pad grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="space-y-5 rounded-3xl border border-white/8 bg-white/[0.02] p-8 animate-pulse"
            >
              <div className="h-3 w-20 rounded bg-white/[0.06]" />
              <div className="h-7 w-32 rounded bg-white/[0.06]" />
              <div className="h-10 w-28 rounded-lg bg-electric/[0.10]" />
              <div className="h-px w-full bg-white/8" />
              <div className="space-y-2.5 pt-2">
                {[0, 1, 2, 3, 4, 5, 6].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-white/[0.06]" />
                    <div
                      className="h-3 rounded bg-white/[0.04]"
                      style={{ width: `${60 + ((j * 37) % 35)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="h-11 w-full rounded-full bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons skeleton */}
      <section className="border-b border-white/5 py-16">
        <div className="container-pad space-y-6">
          <div className="h-3 w-24 rounded bg-white/[0.06]" />
          <div className="h-10 w-1/2 rounded-lg bg-white/[0.05]" />
          <div className="grid gap-4 pt-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4"
              >
                <div className="h-4 w-44 rounded bg-white/[0.05]" />
                <div className="h-4 w-20 rounded bg-electric/[0.08]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
