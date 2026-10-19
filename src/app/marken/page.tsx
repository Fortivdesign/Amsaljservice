import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BrandMark } from "@/components/home/BrandRow";
import { brands, productsByBrand } from "@/data/catalog";

export const metadata: Metadata = { title: "Märken" };

export default function BrandsPage() {
  const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name, "sv"));
  return (
    <div className="container-page pt-5 md:pt-8">
      <Breadcrumbs items={[{ label: "Märken" }]} />
      <div className="mt-5 max-w-3xl md:mt-7">
        <h1 className="text-[32px] leading-tight font-semibold md:text-[44px]">Märken</h1>
        <p className="mt-2 text-ink-soft md:text-[17px]">Välj ett märke för att se alla produkter vi säljer från det.</p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-10 md:gap-4 lg:grid-cols-4">
        {sorted.map((b) => (
          <Link key={b.slug} href={`/marke/${b.slug}`} className="group flex flex-col rounded-2xl border border-line bg-white p-4 transition-shadow hover:shadow-soft md:p-5">
            <div className="grid h-24 place-items-center rounded-xl bg-sand md:h-28">
              <BrandMark slug={b.slug} name={b.name} className="text-xl md:text-2xl" />
            </div>
            <div className="mt-4 flex items-end justify-between gap-2">
              <div>
                <p className="font-semibold">{b.name}</p>
                <p className="text-sm text-muted">
                  {b.country} · {productsByBrand(b.slug).length} produkter
                </p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
