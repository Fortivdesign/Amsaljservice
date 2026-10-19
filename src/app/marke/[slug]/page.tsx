import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";
import { BrandMark } from "@/components/BrandMark";
import { brands, getBrand, productsByBrand } from "@/data/catalog";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getBrand(slug)?.name ?? "Märke" };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();
  const items = productsByBrand(brand.slug);

  return (
    <ProductListing
      key={brand.slug}
      title={brand.name}
      pool={items}
      hideBrandFilter
      breadcrumbs={[{ label: "Märken", href: "/marken" }, { label: brand.name }]}
      header={
        <div className="mt-5 flex flex-col gap-6 rounded-3xl bg-sand p-6 sm:flex-row sm:items-center md:mt-7 md:p-10">
          <div className="grid h-24 w-full shrink-0 place-items-center rounded-2xl bg-white px-6 sm:w-48 md:h-28">
            <BrandMark slug={brand.slug} name={brand.name} className="text-2xl md:text-[28px]" />
          </div>
          <div>
            <p className="eyebrow">Märke från {brand.country}</p>
            <h1 className="mt-1.5 text-[32px] leading-tight font-semibold md:text-[44px]">{brand.name}</h1>
            <p className="mt-1.5 max-w-2xl text-ink-soft md:text-[17px]">{brand.description}</p>
            <p className="mt-3 text-sm font-medium text-ink">{items.length} produkter i sortimentet</p>
          </div>
        </div>
      }
    />
  );
}
