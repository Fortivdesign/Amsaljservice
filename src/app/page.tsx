import { Hero } from "@/components/home/Hero";
import { BrandTicker } from "@/components/home/BrandTicker";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { CampaignSection } from "@/components/home/CampaignSection";
import { BestsellerTabs } from "@/components/home/BestsellerTabs";
import { PromoBanners } from "@/components/home/PromoBanners";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProductRow } from "@/components/home/ProductRow";
import { Reviews } from "@/components/home/Reviews";
import { UspGrid } from "@/components/home/UspGrid";
import { FinalCta } from "@/components/home/FinalCta";
import { newProducts } from "@/data/catalog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandTicker />
      <CategoryTiles />
      <CampaignSection />
      <BestsellerTabs />
      <PromoBanners />
      <HowItWorks />
      <ProductRow kicker="Färskt i lager" title="Nyheter" text="Senaste tillskotten i sortimentet." href="/nyheter" products={newProducts()} />
      <Reviews />
      <UspGrid />
      <FinalCta />
    </>
  );
}
