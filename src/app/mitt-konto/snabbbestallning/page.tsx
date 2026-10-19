import type { Metadata } from "next";
import { QuickOrder } from "@/components/account/QuickOrder";

export const metadata: Metadata = { title: "Snabbbeställning" };

export default function Page() {
  return <QuickOrder />;
}
