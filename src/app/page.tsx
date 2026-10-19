import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ProductRow } from "@/components/home/ProductRow";
import { TrustRow } from "@/components/home/TrustRow";
import { BrandRow } from "@/components/home/BrandRow";
import { BecomeCustomer } from "@/components/home/BecomeCustomer";
import { newProducts, offerProducts, topSellers } from "@/data/catalog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <ProductRow title="Nyheter" text="Senast inkommet i sortimentet." href="/nyheter" products={newProducts()} />
      <ProductRow title="Toppsäljare" text="Det som butikerna beställer mest just nu." href="/sortiment?sortera=popularast" products={topSellers()} />
      <ProductRow title="Erbjudanden" text="Kampanjpriser per kartong så långt lagret räcker." href="/erbjudanden" products={offerProducts()} />
      <TrustRow />
      <BrandRow />
      <BecomeCustomer />
    </>
  );
}
