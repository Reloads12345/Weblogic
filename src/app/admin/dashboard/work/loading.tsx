/**
 * Loading skeleton for /admin/dashboard/work.
 * Mirrors the AdminLayout shell + WorkManager row list so the admin
 * never sees a blank page while getWorkItems() reads the JSON store.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-ink-0 text-bone">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Sidebar skeleton */}
        <aside className="border-b border-white/8 bg-ink-50/40 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-white/8 px-6 py-4 lg:py-5">
            <div className="h-8 w-28 rounded-full bg-white/[0.05]" />
            <div className="h-5 w-14 rounded-full bg-electric/[0.10]" />
          </div>
          <nav className="space-y-1 px-3 py-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              >
                <div className="h-4 w-4 rounded bg-white/[0.05]" />
                <div
                  className="h-3 rounded bg-white/[0.04]"
                  style={{ width: `${55 + ((i * 19) % 35)}%` }}
                />
              </div>
            ))}
          </nav>
        </aside>

        {/* Main skeleton */}
        <main className="relative">
          <header className="sticky top-0 z-10 border-b border-white/8 bg-ink-0/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-4 md:px-10 md:py-6">
              <div className="space-y-2">
                <div className="h-2.5 w-32 rounded bg-white/[0.06]" />
                <div className="h-8 w-48 rounded-lg bg-white/[0.05]" />
                <div className="h-3 w-64 rounded bg-white/[0.04]" />
              </div>
            </div>
          </header>

          <div className="px-6 py-8 md:px-10 md:py-12">
            {/* Toolbar skeleton */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="h-10 w-32 rounded-full bg-electric/[0.10]" />
              <div className="h-10 w-28 rounded-full bg-white/[0.05]" />
              <div className="ml-auto h-10 w-36 rounded-full bg-white/[0.05]" />
            </div>

            {/* Row list skeleton */}
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4 animate-pulse"
                >
                  <div className="h-14 w-20 rounded-lg bg-white/[0.05]" />
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-4 rounded bg-white/[0.06]"
                      style={{ width: `${40 + ((i * 23) % 30)}%` }}
                    />
                    <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
                  </div>
                  <div className="hidden gap-2 md:flex">
                    <div className="h-7 w-16 rounded-full bg-electric/[0.08]" />
                    <div className="h-7 w-14 rounded-full bg-white/[0.05]" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-8 w-8 rounded-lg bg-white/[0.05]" />
                    <div className="h-8 w-8 rounded-lg bg-white/[0.05]" />
                    <div className="h-8 w-8 rounded-lg bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
