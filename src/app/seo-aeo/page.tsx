import type { Metadata } from "next";
import DisciplinePage from "@/components/discipline/DisciplinePage";
import { getDiscipline } from "@/lib/disciplines";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "SEO / AEO",
  description: "Organic + Answer Engine Optimization. We engineer for both Google's index and ChatGPT's citations.",
};

export default function Page() {
  const data = getDiscipline("seo-aeo");
  if (!data) notFound();
  return <DisciplinePage data={data} />;
}
