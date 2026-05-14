import type { Metadata } from "next";
import DisciplinePage from "@/components/discipline/DisciplinePage";
import { getDiscipline } from "@/lib/disciplines";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Engineering",
  description: "Composable, headless, edge-first. Type-safe content models and sub-second LCP at any scale.",
};

export default function Page() {
  const data = getDiscipline("engineering");
  if (!data) notFound();
  return <DisciplinePage data={data} />;
}
