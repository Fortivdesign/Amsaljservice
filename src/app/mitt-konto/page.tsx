import type { Metadata } from "next";
import { Overview } from "@/components/account/Overview";

export const metadata: Metadata = { title: "Mitt konto" };

export default function Page() {
  return <Overview />;
}
