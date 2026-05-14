import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { getLegal } from "@/lib/legal";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Press Kit",
  description: "Brand assets, boilerplate, fact sheet, and founder bio.",
};

export default function Page() {
  const data = getLegal("press-kit");
  if (!data) notFound();
  return <LegalPage data={data} />;
}
