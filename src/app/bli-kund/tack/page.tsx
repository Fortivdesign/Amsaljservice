import type { Metadata } from "next";
import { ApplicationReceived } from "@/components/ApplicationReceived";

export const metadata: Metadata = { title: "Ansökan mottagen" };

export default function ThanksPage() {
  return <ApplicationReceived />;
}
