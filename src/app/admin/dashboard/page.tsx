import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardClient />;
}
