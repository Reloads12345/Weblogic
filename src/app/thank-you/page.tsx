import type { Metadata } from "next";
import ThankYouClient from "./ThankYouClient";

export const metadata: Metadata = {
  title: "Thank you — audit request received",
  description: "Your WebLogic audit request was received. Here's what happens next.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYouClient />;
}
