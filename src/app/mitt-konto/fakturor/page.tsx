import type { Metadata } from "next";
import { Invoices } from "@/components/account/Invoices";

export const metadata: Metadata = { title: "Fakturor" };

export default function Page() {
  return <Invoices />;
}
