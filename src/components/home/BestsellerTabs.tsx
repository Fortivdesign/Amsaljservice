"use client";

import { useState } from "react";
import { categories, products, type CategorySlug } from "@/data/catalog";
import { categoryStyle } from "@/lib/categoryStyle";
import { ProductCard } from "../ProductCard";
import { SectionHeading } from "./SectionHeading";

/** Bästsäljare med flikar per kategori och placering (#1, #2 ...). */
export function BestsellerTabs() {
  const [tab, setTab] = useState<CategorySlug | "alla">("alla");
  const list = products
    .filter((p) => (tab === "alla" ? p.topSeller : p.category === tab))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  const tabs: { key: CategorySlug | "alla"; label: string; dot?: string }[] = [
    { key: "alla", label: "Alla" },
    ...categories.map((c) => ({ key: c.slug, label: c.name, dot: categoryStyle[c.slug].dot })),
  ];

  return (
    <section className="container-page mt-16 md:mt-24" data-testid="bestsellers">
      <SectionHeading kicker="Det butikerna beställer mest" title="Bästsäljare just nu" href="/sortiment?sortera=popularast" />
      <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Kategori">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`flex h-10 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors ${
              tab === t.key ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
            }`}
          >
            {t.dot && <span className={`size-2.5 rounded-full ${t.dot}`} />}
            {t.label}
          </button>
        ))}
      </div>
      <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-5 md:[&>*:nth-child(5)]:hidden lg:[&>*:nth-child(5)]:block">
        {list.map((p, i) => (
          <div key={p.articleNo} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-auto">
            <ProductCard product={p} rank={i + 1} />
          </div>
        ))}
      </div>
    </section>
  );
}
