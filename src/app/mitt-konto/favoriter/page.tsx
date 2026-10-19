import type { Metadata } from "next";
import { Favorites } from "@/components/account/Favorites";

export const metadata: Metadata = { title: "Favoriter" };

export default function Page() {
  return <Favorites />;
}
