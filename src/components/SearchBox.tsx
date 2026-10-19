"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { brands, categories, getBrand, packLabel, currentPrice } from "@/data/catalog";
import { searchProducts } from "@/lib/search";
import { formatPrice, normalize } from "@/lib/format";
import { useShop } from "@/context/ShopContext";
import { LIMITED_DEMO, LIMITED_DETAIL, LIMITED_MESSAGE } from "@/lib/demoMode";
import { ProductImage } from "./ProductImage";

const popular = ["Dr Pepper", "Monster", "Goya", "Saltín Noel", "Buljong"];

export function SearchBox({ className = "", autoFocus = false, onNavigate }: { className?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const { user, showToast } = useShop();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => searchProducts(query).slice(0, 5), [query]);
  const brandHits = useMemo(() => {
    const q = normalize(query);
    return q ? brands.filter((b) => normalize(b.name).includes(q)).slice(0, 4) : [];
  }, [query]);
  const categoryHits = useMemo(() => {
    const q = normalize(query);
    return q ? categories.filter((c) => normalize(c.name).includes(q)) : [];
  }, [query]);

  // Berätta för sök-nudgen vad besökaren letar efter (efter en kort paus i skrivandet)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;
    const id = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("am:search", { detail: { query: q, hits: searchProducts(q).length } }));
    }, 700);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
  };

  const submit = (q = query) => {
    if (!q.trim()) return;
    if (LIMITED_DEMO) {
      showToast({ message: LIMITED_MESSAGE, detail: LIMITED_DETAIL, tone: "info" });
      return;
    }
    close();
    router.push(`/sok?q=${encodeURIComponent(q.trim())}`);
  };

  const hasQuery = query.trim().length > 0;
  const nothing = hasQuery && results.length === 0 && brandHits.length === 0 && categoryHits.length === 0;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Sök produkter
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted" strokeWidth={2} />
        <input
          id={`${listId}-input`}
          type="search"
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Sök produkt, märke eller artikelnummer"
          aria-controls={listId}
          aria-expanded={open}
          className="h-11 w-full rounded-full border-2 border-transparent bg-sand pr-10 pl-11 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink focus:bg-white [&::-webkit-search-cancel-button]:hidden"
        />
        {hasQuery && (
          <button
            type="button"
            aria-label="Rensa sökning"
            onClick={() => setQuery("")}
            className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-cream hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {open && (
        <div
          id={listId}
          className="animate-fade-in absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
        >
          {!hasQuery ? (
            <div className="p-4">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Populära sökningar</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {popular.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                    }}
                    className="rounded-full border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:border-ink"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : nothing ? (
            <div className="p-5 text-sm text-ink-soft">
              Inga träffar på <span className="font-semibold text-ink">”{query}”</span>. Prova ett märke eller ett artikelnummer.
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              {results.length > 0 && (
                <div className="p-2">
                  <p className="px-2 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">Produkter</p>
                  <ul>
                    {results.map((p) => (
                      <li key={p.articleNo}>
                        <Link href={`/produkt/${p.slug}`} onClick={close} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-sand">
                          <ProductImage product={p} className="!w-12 shrink-0" rounded="rounded-lg" padding="p-1" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                            <span className="block truncate text-xs text-muted">
                              {getBrand(p.brand)?.name} · {packLabel(p)} · Art.nr {p.articleNo}
                            </span>
                          </span>
                          {user && <span className="shrink-0 text-sm font-semibold tabular-nums">{formatPrice(currentPrice(p))}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(brandHits.length > 0 || categoryHits.length > 0) && (
                <div className="border-t border-line p-4">
                  <div className="flex flex-wrap gap-2">
                    {categoryHits.map((c) => (
                      <Link key={c.slug} href={`/kategori/${c.slug}`} onClick={close} className="rounded-full bg-sand px-3 py-1.5 text-sm font-medium hover:bg-cream">
                        Kategori: {c.name}
                      </Link>
                    ))}
                    {brandHits.map((b) => (
                      <Link key={b.slug} href={`/marke/${b.slug}`} onClick={close} className="rounded-full bg-sand px-3 py-1.5 text-sm font-medium hover:bg-cream">
                        Märke: {b.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => submit()}
                className="flex w-full items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-sand"
              >
                Visa alla resultat för ”{query}”
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
