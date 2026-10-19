import type { Metadata } from "next";
import { Lists } from "@/components/account/Lists";

export const metadata: Metadata = { title: "Inköpslistor" };

export default function Page() {
  return <Lists />;
}
