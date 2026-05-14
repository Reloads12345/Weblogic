import type { Metadata } from "next";
import DisciplinePage from "@/components/discipline/DisciplinePage";
import { getDiscipline } from "@/lib/disciplines";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Strategy",
  description: "Positioning, narrative, and ICP — translated into a site that actually moves pipeline.",
};

export default function Page() {
  const data = getDiscipline("strategy");
  if (!data) notFound();
  return <DisciplinePage data={data} />;
}
