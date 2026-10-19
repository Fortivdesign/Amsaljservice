import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, getBrand, productsInCategory } from "@/data/catalog";
import { PackPlaceholder } from "../PackPlaceholder";
import { productImageUrl } from "../ProductImage";
import { SectionHeading } from "./SectionHeading";

export function CategoryCards() {
  return (
    <section className="container-page mt-14 md:mt-20">
      <SectionHeading title="Handla efter kategori" href="/sortiment" linkLabel="Alla produkter" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
        {categories.map((c, i) => {
          const items = productsInCategory(c.slug)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 3);
          return (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className={`group relative flex flex-col overflow-hidden rounded-2xl bg-sand p-4 transition-colors hover:bg-cream md:p-5 ${
                i === categories.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <div className="flex h-28 items-end justify-center md:h-36">
                {items.map((p, idx) => {
                  const url = productImageUrl(p);
                  return (
                    <div
                      key={p.articleNo}
                      className={`w-[30%] max-w-[84px] transition-transform duration-300 group-hover:-translate-y-1 ${idx === 1 ? "z-10 -mx-1.5 scale-110" : "opacity-90"}`}
                    >
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" className="aspect-square w-full object-contain mix-blend-multiply" />
                      ) : (
                        <PackPlaceholder shape={p.shape} label={getBrand(p.brand)?.name} tight className="w-full" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                  <h3 className="text-[17px] font-semibold md:text-lg">{c.name}</h3>
                  <p className="text-sm text-muted">{productsInCategory(c.slug).length} produkter</p>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
