import type { Metadata } from "next";
import DisciplinePage from "@/components/discipline/DisciplinePage";
import { getDiscipline } from "@/lib/disciplines";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "AI",
  description: "AI-driven content, search, and personalization woven into the marketing stack — not bolted on.",
};

export default function Page() {
  const data = getDiscipline("ai");
  if (!data) notFound();
  return <DisciplinePage data={data} />;
}
