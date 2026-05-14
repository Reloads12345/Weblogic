import type { Metadata } from "next";
import DisciplinePage from "@/components/discipline/DisciplinePage";
import { getDiscipline } from "@/lib/disciplines";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Design",
  description: "Brand-native systems and interfaces engineered to convert without diluting the product.",
};

export default function Page() {
  const data = getDiscipline("design");
  if (!data) notFound();
  return <DisciplinePage data={data} />;
}
