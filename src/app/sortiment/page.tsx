import type { Metadata } from "next";
import { ProductListing, type SortKey } from "@/components/ProductListing";
import { products } from "@/data/catalog";

export const metadata: Metadata = { title: "Alla produkter" };

const allowed: SortKey[] = ["popularast", "nyast", "namn", "pris-lag", "pris-hog"];

export default async function AllProductsPage({ searchParams }: { searchParams: Promise<{ sortera?: string }> }) {
  const { sortera } = await searchParams;
  const initialSort = allowed.includes(sortera as SortKey) ? (sortera as SortKey) : "popularast";
  return (
    <ProductListing
      title="Alla produkter"
      description="Hela sortimentet per kartong. Filtrera på kategori och märke."
      pool={products}
      breadcrumbs={[{ label: "Alla produkter" }]}
      initialSort={initialSort}
    />
  );
}
