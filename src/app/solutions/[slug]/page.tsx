import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionPage from "@/components/solution/SolutionPage";
import { SOLUTIONS, getSolution } from "@/lib/solutions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getSolution(slug);
  if (!data) return { title: "Not Found" };
  return {
    title: data.label,
    description: data.hero,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = getSolution(slug);
  if (!data) notFound();
  return <SolutionPage data={data} />;
}
