import type { Metadata } from "next";
import { ProductListing } from "@/components/ProductListing";
import { newProducts } from "@/data/catalog";

export const metadata: Metadata = { title: "Nyheter" };

export default function NewsPage() {
  return (
    <ProductListing
      title="Nyheter"
      description="Produkter som nyss kommit in i sortimentet."
      pool={newProducts()}
      initialSort="nyast"
      breadcrumbs={[{ label: "Nyheter" }]}
    />
  );
}
