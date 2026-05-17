/**
 * Loading skeleton for /checkout.
 * Renders instantly so users never see a blank page when arriving from a pricing CTA.
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
          <div className="h-10 w-[180px] rounded bg-white/[0.05] md:h-20 md:w-[352px] lg:h-32 lg:w-[560px]" />
          <div className="absolute left-1/2 h-8 w-44 -translate-x-1/2 rounded-full bg-white/[0.04] md:h-10 md:w-56" />
          <div className="h-9 w-32 rounded-full bg-white/[0.04]" />
        </div>
      </div>

      <section className="border-b border-white/5 py-16 md:py-24">
        <div className="container-pad grid gap-10 md:grid-cols-12">
          {/* Form column */}
          <div className="md:col-span-7 space-y-6">
            <div className="h-3 w-32 rounded bg-white/[0.06]" />
            <div className="h-10 w-2/3 rounded-lg bg-white/[0.05] md:h-14" />
            <div className="space-y-4 pt-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-24 rounded bg-white/[0.06]" />
                  <div className="h-11 w-full rounded-lg bg-white/[0.04]" />
                </div>
              ))}
            </div>
            <div className="h-12 w-full rounded-full bg-electric/[0.12]" />
          </div>

          {/* Summary column */}
          <div className="md:col-span-5">
            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6 animate-pulse">
              <div className="h-4 w-24 rounded bg-white/[0.06]" />
              <div className="h-7 w-3/4 rounded-lg bg-white/[0.05]" />
              <div className="h-px w-full bg-white/8" />
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
                    <div className="h-3 w-16 rounded bg-white/[0.04]" />
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-white/8" />
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-white/[0.06]" />
                <div className="h-6 w-24 rounded bg-electric/[0.10]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
