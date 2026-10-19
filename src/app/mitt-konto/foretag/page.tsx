import type { Metadata } from "next";
import { Company } from "@/components/account/Company";

export const metadata: Metadata = { title: "Företag och adresser" };

export default function Page() {
  return <Company />;
}
