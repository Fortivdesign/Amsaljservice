import type { Metadata } from "next";
import { ProductListing } from "@/components/ProductListing";
import { searchProducts } from "@/lib/search";

export const metadata: Metadata = { title: "Sök" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const hits = searchProducts(q);
  return (
    <ProductListing
      key={q}
      title={q ? `Sökresultat för ”${q}”` : "Sök"}
      description={hits.length ? `${hits.length} produkter matchar din sökning.` : "Inga produkter matchar sökningen. Prova ett märke, en produkttyp eller ett artikelnummer."}
      pool={hits}
      breadcrumbs={[{ label: "Sök" }]}
      emptyText="Inga produkter hittades."
    />
  );
}
