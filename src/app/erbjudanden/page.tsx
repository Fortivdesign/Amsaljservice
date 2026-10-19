import type { Metadata } from "next";
import { ProductListing } from "@/components/ProductListing";
import { offerProducts } from "@/data/catalog";

export const metadata: Metadata = { title: "Erbjudanden" };

export default function OffersPage() {
  return (
    <ProductListing
      title="Erbjudanden"
      eyebrow="Gäller så långt lagret räcker"
      description="Kampanjpriser per kartong för inloggade kunder."
      pool={offerProducts()}
      breadcrumbs={[{ label: "Erbjudanden" }]}
    />
  );
}
