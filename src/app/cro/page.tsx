import type { Metadata } from "next";
import DisciplinePage from "@/components/discipline/DisciplinePage";
import { getDiscipline } from "@/lib/disciplines";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "CRO",
  description: "Per-visitor experiences shipped on the edge — without a CRO consultant on retainer.",
};

export default function Page() {
  const data = getDiscipline("cro");
  if (!data) notFound();
  return <DisciplinePage data={data} />;
}
