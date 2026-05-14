/**
 * Loading skeleton for /work/[slug].
 * Renders instantly during navigation so the page never flashes blank
 * while the dynamic data + RSC fetch resolves.
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
          <div className="h-8 w-[140px] rounded bg-white/[0.05] md:h-40 md:w-[720px] md:max-w-[60vw] lg:h-44 lg:w-[800px]" />
          <div className="absolute left-1/2 h-8 w-44 -translate-x-1/2 rounded-full bg-white/[0.04] md:h-10 md:w-56" />
          <div className="h-9 w-32 rounded-full bg-white/[0.04]" />
        </div>
      </div>

      {/* Hero skeleton */}
      <section className="border-b border-white/5 py-20 md:py-28">
        <div className="container-pad space-y-6">
          <div className="h-3 w-40 rounded bg-white/[0.06]" />
          <div className="h-16 w-2/3 rounded-lg bg-white/[0.05] md:h-24" />
          <div className="h-5 w-3/4 rounded bg-white/[0.04]" />
          <div className="flex gap-2 pt-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-electric/[0.08]" />
            ))}
          </div>
        </div>
      </section>

      {/* Cover skeleton */}
      <section className="border-b border-white/5 py-12 md:py-16">
        <div className="container-pad">
          <div className="aspect-[16/10] w-full animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </section>

      {/* Body skeleton */}
      <section className="border-b border-white/5 py-20">
        <div className="container-pad grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4 space-y-3">
            <div className="h-3 w-24 rounded bg-white/[0.06]" />
            <div className="h-10 w-3/4 rounded-lg bg-white/[0.05]" />
          </div>
          <div className="md:col-span-8 space-y-3">
            <div className="h-4 rounded bg-white/[0.04]" />
            <div className="h-4 w-11/12 rounded bg-white/[0.04]" />
            <div className="h-4 w-10/12 rounded bg-white/[0.04]" />
            <div className="h-4 w-9/12 rounded bg-white/[0.04]" />
          </div>
        </div>
      </section>
    </main>
  );
}
