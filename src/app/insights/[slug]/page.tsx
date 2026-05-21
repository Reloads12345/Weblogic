import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import Header from "@/components/nav/Header";
import Footer from "@/components/sections/Footer";
import { POSTS, BRAND } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Insight not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

/**
 * /insights/[slug] — placeholder for now. Each POST in data.ts gets a
 * server-rendered page with cover + author + excerpt + a "coming soon"
 * body until real long-form is written.
 *
 * This unlocks the homepage's Insights cards (previously inert) without
 * needing a CMS. Future: replace the placeholder body with MDX content,
 * or move POSTS to a headless CMS.
 */
export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="bg-ink-0 text-bone">
        {/* Article header */}
        <article className="pt-32 md:pt-40">
          <div className="container-pad mx-auto max-w-3xl">
            <Link
              href="/#insights"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition hover:text-bone"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to insights
            </Link>

            <header className="mt-8 space-y-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                / {post.category}
              </p>
              <h1 className="text-balance font-display text-display-md leading-[0.95] tracking-tightest md:text-display-lg">
                {post.title}
              </h1>
              <p className="text-pretty text-lg text-bone/75 md:text-xl">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 border-t border-white/8 pt-5 text-xs text-mute">
                <span className="text-bone">{post.author.name}</span>
                <span>·</span>
                <span>{post.author.role}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
            </header>

            <div className="my-12 aspect-[16/8] overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-electric/15 via-ink-100 to-ink-0">
              <div className="grid h-full place-items-center text-white/35">
                <div className="text-center">
                  <p className="font-display text-7xl tracking-tightest text-white/15 md:text-9xl">
                    {String(
                      POSTS.findIndex((p) => p.slug === post.slug) + 1,
                    ).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em]">
                    {post.category}
                  </p>
                </div>
              </div>
            </div>

            {/* Honest placeholder body */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="rounded-2xl border border-white/10 bg-ink-50/40 p-6 md:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                  / Writing in progress
                </p>
                <p className="mt-4 text-bone/85 md:text-lg">
                  This long-form piece is in production. The shorter
                  preview above captures the thesis — the full breakdown
                  ships in the next publishing round.
                </p>
                <p className="mt-4 text-bone/65">
                  Want this delivered the moment it&apos;s live? Reply to
                  any WebLogic email with{" "}
                  <span className="text-bone">subscribe</span> in the
                  subject line, or follow along on the social links in the
                  footer.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/connect"
                    className="inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-medium text-ink-0 transition hover:-translate-y-0.5"
                  >
                    Book a free audit
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`mailto:${BRAND.email}?subject=Subscribe%20to%20Insights`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm text-bone transition hover:border-white/30"
                  >
                    Email {BRAND.email}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <hr className="my-16 border-white/8" />

            {/* Related posts */}
            <section>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                / More insights
              </p>
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {POSTS.filter((p) => p.slug !== post.slug)
                  .slice(0, 4)
                  .map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/insights/${p.slug}`}
                        className="group flex flex-col gap-2 rounded-2xl border border-white/8 bg-ink-50/40 p-5 transition hover:-translate-y-0.5 hover:border-electric/40"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric">
                          {p.category}
                        </span>
                        <span className="font-display text-lg leading-tight tracking-tight text-bone group-hover:text-electric">
                          {p.title}
                        </span>
                        <span className="line-clamp-2 text-sm text-mute">
                          {p.excerpt}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          </div>
        </article>

        <div className="h-24" />
      </main>
      <Footer />
    </>
  );
}
