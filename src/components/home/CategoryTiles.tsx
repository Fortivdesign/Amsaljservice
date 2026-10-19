import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, productsInCategory } from "@/data/catalog";
import { categoryStyle } from "@/lib/categoryStyle";
import { SectionHeading } from "./SectionHeading";

/** Stora kategorikort med foto och färgfält, i stil med moderna modebutiker. */
export function CategoryTiles() {
  return (
    <section className="container-page mt-14 md:mt-20">
      <SectionHeading kicker="Hela sortimentet" title="Handla efter kategori" href="/sortiment" linkLabel="Alla produkter" />
      <div className="mt-7 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
        {categories.map((c, i) => {
          const style = categoryStyle[c.slug];
          const count = productsInCategory(c.slug).length;
          return (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className={`group relative flex flex-col overflow-hidden rounded-[28px] ${style.bg} ${style.text} ${i === categories.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
              data-testid="category-tile"
            >
              <div className={`relative overflow-hidden ${i === categories.length - 1 ? "aspect-[2.2/1] lg:aspect-[4/5]" : "aspect-[4/5]"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={style.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-ink">{count} produkter</span>
              </div>
              <div className="flex items-end justify-between gap-2 p-4 md:p-5">
                <div className="min-w-0">
                  <h3 className="font-poster text-[22px] leading-[1.02] tracking-wide uppercase sm:text-[26px] md:text-[30px]">{c.name}</h3>
                  <p className="mt-1.5 text-[13px] font-medium opacity-85">{style.tagline}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/90 text-ink transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-5" strokeWidth={2.2} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
