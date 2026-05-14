import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { getLegal } from "@/lib/legal";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Security",
  description: "How WebLogic protects code, content, and customer data.",
};

export default function Page() {
  const data = getLegal("security");
  if (!data) notFound();
  return <LegalPage data={data} />;
}
