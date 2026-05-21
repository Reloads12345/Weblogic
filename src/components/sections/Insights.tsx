"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { POSTS } from "@/lib/data";
import { useAssets } from "@/components/providers/AssetProvider";
import { cn } from "@/lib/utils";

export default function Insights() {
  const { getImageUrl } = useAssets();

  return (
    <section
      id="insights"
      className="relative bg-ink-0 border-t border-white/5 py-24 md:py-32"
    >
      <div className="container-pad">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">/ Insights</p>
            <h2 className="section-h mt-5 max-w-[18ch] text-balance">
              Field notes from the{" "}
              <span className="text-mute">composable frontier</span>.
            </h2>
          </div>
        </div>

        {/* 5-up grid (1 hero col-span-6 row-span-2 + 4 small col-span-3) */}
        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {POSTS.map((p, i) => {
            const coverUrl = getImageUrl(p.cover);
            const isHero = i === 0;
            const Wrapper = motion(Link);
            return (
              <Wrapper
                key={p.slug}
                href={`/insights/${p.slug}`}
                data-cursor="link"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-ink-0 transition-colors duration-500 hover:border-white/20",
                  isHero ? "md:col-span-6 md:row-span-2" : "md:col-span-3",
                )}
              >
                {/* Cover — uses uploaded image if set, else falls back to numeral gradient */}
                <div
                  className={cn(
                    "relative overflow-hidden bg-ink-100",
                    isHero ? "aspect-[16/11]" : "aspect-[5/3]",
                  )}
                >
                  {coverUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverUrl}
                        alt={p.title}
                        loading={isHero ? "eager" : "lazy"}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      {/* Slight tint for legibility */}
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-ink-0/45 via-ink-0/0 to-ink-0/0"
                      />
                    </>
                  ) : (
                    <>
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(60% 80% at 50% 100%, rgba(0,82,255,0.15), transparent 70%)",
                        }}
                      />
                      <span
                        aria-hidden
                        className="absolute -bottom-6 -right-2 font-display text-[10rem] leading-none tracking-tightest text-white/[0.03]"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </>
                  )}

                  {/* Always-on chips on top of any cover */}
                  <span className="absolute right-5 top-5 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                    {String(i + 1).padStart(2, "0")} / {POSTS.length}
                  </span>
                  <span className="absolute left-5 top-5 z-10 rounded-full border border-white/15 bg-ink-100/70 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-bone/85 backdrop-blur">
                    {p.category}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3
                    className={cn(
                      "text-pretty font-display tracking-tightest text-bone transition-colors duration-500 group-hover:text-electric",
                      isHero ? "text-3xl md:text-4xl" : "text-lg md:text-xl",
                    )}
                  >
                    {p.title}
                  </h3>
                  {isHero ? (
                    <p className="mt-4 text-mute">{p.excerpt}</p>
                  ) : (
                    <p className="mt-2 line-clamp-2 text-sm text-mute">{p.excerpt}</p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-6 text-[10px] font-mono uppercase tracking-[0.18em] text-mute">
                    <span>
                      <span className="text-bone">{p.author.name}</span> · {p.author.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {p.readTime}
                    </span>
                  </div>
                </div>

                {/* Read-more affordance on every card */}
                <span className="absolute right-4 bottom-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-ink-100/80 text-white/65 backdrop-blur transition group-hover:border-electric group-hover:bg-electric group-hover:text-ink-0">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
