import type { Metadata } from "next";
import WorkManagerClient from "./WorkManagerClient";
import { getWorkItems } from "@/lib/work-store";

export const metadata: Metadata = {
  title: "Admin · Work Manager",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const items = await getWorkItems();
  return <WorkManagerClient initialItems={items} />;
}
