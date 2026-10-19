"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { brands, categories, currentPrice, type CategorySlug, type Product } from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export type SortKey = "popularast" | "nyast" | "namn" | "pris-lag" | "pris-hog";

const sortOptions: { key: SortKey; label: string; needsLogin?: boolean }[] = [
  { key: "popularast", label: "Populärast" },
  { key: "nyast", label: "Nyast först" },
  { key: "namn", label: "Namn A till Ö" },
  { key: "pris-lag", label: "Lägst pris först", needsLogin: true },
  { key: "pris-hog", label: "Högst pris först", needsLogin: true },
];

function Checkbox({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-[14.5px]">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 ${
          checked ? "border-ink bg-ink text-white" : "border-line-strong bg-white group-hover:border-ink-soft"
        }`}
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      <span className={`flex-1 ${checked ? "font-semibold text-ink" : "text-ink-soft"}`}>{label}</span>
      {count !== undefined && <span className="text-xs text-muted tabular-nums">{count}</span>}
    </label>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-line py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-2 font-sans text-[13px] font-semibold tracking-[0.06em] text-ink uppercase">{title}</h3>
      {children}
    </div>
  );
}

function toggle<T>(set: T[], value: T): T[] {
  return set.includes(value) ? set.filter((v) => v !== value) : [...set, value];
}

export function ProductListing({
  title,
  eyebrow,
  description,
  pool,
  breadcrumbs,
  initialCategory,
  hideBrandFilter = false,
  hideCategoryFilter = false,
  initialSort = "popularast",
  header,
  emptyText = "Inga produkter matchar filtret.",
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  pool: Product[];
  breadcrumbs: Crumb[];
  initialCategory?: CategorySlug;
  hideBrandFilter?: boolean;
  hideCategoryFilter?: boolean;
  initialSort?: SortKey;
  header?: ReactNode;
  emptyText?: string;
}) {
  const { user, hydrated } = useShop();
  const [cats, setCats] = useState<CategorySlug[]>(initialCategory ? [initialCategory] : []);
  const [brandSel, setBrandSel] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
  }, [sheetOpen]);

  const loggedIn = hydrated && !!user;
  const activeSort = !loggedIn && sortOptions.find((o) => o.key === sort)?.needsLogin ? "popularast" : sort;

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ ...c, count: pool.filter((p) => p.category === c.slug).length })).filter((c) => c.count > 0),
    [pool],
  );

  const brandOptions = useMemo(() => {
    const inCats = cats.length ? pool.filter((p) => cats.includes(p.category)) : pool;
    return brands
      .map((b) => ({ ...b, count: inCats.filter((p) => p.brand === b.slug).length }))
      .filter((b) => b.count > 0 || brandSel.includes(b.slug));
  }, [pool, cats, brandSel]);

  const results = useMemo(() => {
    const list = pool.filter(
      (p) =>
        (cats.length === 0 || cats.includes(p.category)) &&
        (brandSel.length === 0 || brandSel.includes(p.brand)) &&
        (!inStock || p.stock !== "slut") &&
        (!offersOnly || !!p.offerPrice),
    );
    const sorted = [...list];
    switch (activeSort) {
      case "nyast":
        sorted.sort((a, b) => b.addedDate.localeCompare(a.addedDate));
        break;
      case "namn":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "sv"));
        break;
      case "pris-lag":
        sorted.sort((a, b) => currentPrice(a) - currentPrice(b));
        break;
      case "pris-hog":
        sorted.sort((a, b) => currentPrice(b) - currentPrice(a));
        break;
      default:
        sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [pool, cats, brandSel, inStock, offersOnly, activeSort]);

  const chips = [
    ...cats.filter((c) => c !== initialCategory || cats.length > 1).map((c) => ({ key: `c-${c}`, label: categories.find((x) => x.slug === c)?.name ?? c, remove: () => setCats(toggle(cats, c)) })),
    ...brandSel.map((b) => ({ key: `b-${b}`, label: brands.find((x) => x.slug === b)?.name ?? b, remove: () => setBrandSel(toggle(brandSel, b)) })),
    ...(inStock ? [{ key: "stock", label: "I lager", remove: () => setInStock(false) }] : []),
    ...(offersOnly ? [{ key: "offer", label: "Erbjudanden", remove: () => setOffersOnly(false) }] : []),
  ];

  const clearAll = () => {
    setCats(initialCategory ? [initialCategory] : []);
    setBrandSel([]);
    setInStock(false);
    setOffersOnly(false);
  };

  const filters = (
    <div>
      {!hideCategoryFilter && (
        <FilterGroup title="Kategori">
          {categoryOptions.map((c) => (
            <Checkbox key={c.slug} checked={cats.includes(c.slug)} onChange={() => setCats(toggle(cats, c.slug))} label={c.name} count={c.count} />
          ))}
        </FilterGroup>
      )}
      {!hideBrandFilter && (
        <FilterGroup title="Märke">
          {brandOptions.map((b) => (
            <Checkbox key={b.slug} checked={brandSel.includes(b.slug)} onChange={() => setBrandSel(toggle(brandSel, b.slug))} label={b.name} count={b.count} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Visa">
        <Checkbox checked={inStock} onChange={() => setInStock(!inStock)} label="Endast varor i lager" />
        <Checkbox checked={offersOnly} onChange={() => setOffersOnly(!offersOnly)} label="Endast erbjudanden" />
      </FilterGroup>
    </div>
  );

  const filterCount = chips.length;

  return (
    <div className="container-page pt-5 md:pt-8">
      <Breadcrumbs items={breadcrumbs} />
      {header ?? (
        <div className="mt-5 max-w-3xl md:mt-7">
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h1 className="text-[32px] leading-tight font-semibold md:text-[44px]">{title}</h1>
          {description && <p className="mt-2 text-ink-soft md:text-[17px]">{description}</p>}
        </div>
      )}

      <div className="mt-7 md:mt-10 lg:grid lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block" aria-label="Filter">
          <div className="sticky top-40">{filters}</div>
        </aside>

        <div>
          <div className="flex items-center gap-2 border-b border-line pb-4">
            <button type="button" onClick={() => setSheetOpen(true)} className="btn btn-sm btn-outline lg:hidden" data-testid="filter-button">
              <SlidersHorizontal className="size-4" />
              Filtrera
              {filterCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink text-[11px] text-white">{filterCount}</span>}
            </button>
            <p className="hidden text-sm text-ink-soft sm:block" data-testid="result-count">
              <span className="font-semibold text-ink">{results.length}</span> produkter
            </p>
            <div className="relative ml-auto">
              <label htmlFor="sort" className="sr-only">
                Sortera
              </label>
              <select
                id="sort"
                value={activeSort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 appearance-none rounded-full border border-line-strong bg-white pr-9 pl-4 text-sm font-medium text-ink outline-none hover:border-ink"
              >
                {sortOptions
                  .filter((o) => loggedIn || !o.needsLogin)
                  .map((o) => (
                    <option key={o.key} value={o.key}>
                      Sortera: {o.label}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-soft" />
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.remove}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sand py-1.5 pr-2.5 pl-3 text-sm font-medium hover:bg-cream"
                >
                  {chip.label}
                  <X className="size-3.5" />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="px-2 text-sm font-medium text-ink-soft underline underline-offset-4 hover:text-ink">
                Rensa alla
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-sand px-6 py-14 text-center">
              <p className="font-display text-lg font-semibold">{emptyText}</p>
              <button type="button" onClick={clearAll} className="btn btn-outline mt-5">
                Rensa filter
              </button>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-4" data-testid="product-grid">
              {results.map((p) => (
                <ProductCard key={p.articleNo} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {sheetOpen &&
        createPortal(
          <div className="fixed inset-0 z-[65] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter">
            <div className="animate-fade-in absolute inset-0 bg-ink/40" onClick={() => setSheetOpen(false)} />
            <div className="animate-slide-up absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-3xl bg-white">
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
                <h2 className="text-lg font-semibold">Filtrera</h2>
                <button type="button" onClick={() => setSheetOpen(false)} aria-label="Stäng filter" className="grid size-10 place-items-center rounded-full hover:bg-sand">
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">{filters}</div>
              <div className="flex shrink-0 gap-2 border-t border-line p-4">
                <button type="button" onClick={clearAll} className="btn btn-outline">
                  Rensa
                </button>
                <button type="button" onClick={() => setSheetOpen(false)} className="btn btn-dark flex-1">
                  Visa {results.length} produkter
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
