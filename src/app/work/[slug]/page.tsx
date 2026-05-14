import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkClient from "./WorkClient";
import { getWorkItems } from "@/lib/work-store";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getWorkItems();
  return items.map((c) => ({ slug: c.slug }));
}

// Allow on-demand rendering of slugs that didn't exist at build time
// (any project the admin adds later still gets a working /work/[slug] page).
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const items = await getWorkItems();
  const cs = items.find((c) => c.slug === slug);
  if (!cs) return { title: "Not found" };
  return {
    title: `${cs.client} — ${cs.category || cs.label}`,
    description: cs.headline,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const items = await getWorkItems();
  const cs = items.find((c) => c.slug === slug);
  if (!cs) notFound();
  return <WorkClient slug={slug} item={cs} items={items} />;
}
