"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Check, ClipboardList, FileText, Lock, ShoppingBag, Truck } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { currentPrice, getBrand, getCategory, getProduct, packLabel, similarProducts } from "@/data/catalog";
import { shopConfig } from "@/config/shop";
import { formatDateLong, formatPrice } from "@/lib/format";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductImage } from "./ProductImage";
import { ProductBadges } from "./Badges";
import { FavoriteButton } from "./FavoriteButton";
import { QuantityStepper } from "./QuantityStepper";
import { StockStatus } from "./StockStatus";
import { PriceBlock } from "./ProductCard";
import { ProductRow } from "./home/ProductRow";

function SaveToList({ articleNo, qty }: { articleNo: string; qty: number }) {
  const { lists, addToList } = useShop();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={ref} className="relative flex-1">
      <button type="button" onClick={() => setOpen(!open)} className="btn btn-outline w-full" aria-expanded={open}>
        <ClipboardList className="size-[18px]" strokeWidth={1.8} />
        Spara i inköpslista
      </button>
      {open && (
        <div className="animate-fade-in absolute top-[calc(100%+6px)] left-0 z-20 w-full min-w-72 rounded-2xl border border-line bg-white p-2 shadow-lift">
          {lists.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                addToList(l.id, articleNo, qty);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-sand"
            >
              <span className="font-medium">{l.name}</span>
              <span className="shrink-0 pl-3 text-xs whitespace-nowrap text-muted">{l.items.length} artiklar</span>
            </button>
          ))}
          <Link href="/mitt-konto/inkopslistor" className="mt-1 block border-t border-line px-3 pt-2.5 pb-1.5 text-sm font-semibold text-ink-soft hover:text-ink">
            Hantera inköpslistor
          </Link>
        </div>
      )}
    </div>
  );
}

export function ProductDetail({ articleNo }: { articleNo: string }) {
  const product = getProduct(articleNo)!;
  const { user, hydrated, addToCart } = useShop();
  const [qty, setQty] = useState(1);
  const brand = getBrand(product.brand);
  const category = getCategory(product.category);
  const loggedIn = hydrated && !!user;
  const soldOut = product.stock === "slut";

  const facts: [string, string][] = [
    ["Artikelnummer", product.articleNo],
    ["EAN", product.ean],
    ["Förpackning", `${packLabel(product)} per kartong`],
    ["Bäst före tidigast", formatDateLong(product.bestBefore)],
    ["Ursprungsland", product.origin],
    ["Kartonger per pall", String(product.cartonsPerPallet)],
    ["Vikt per kartong", `${product.cartonWeightKg.toLocaleString("sv-SE")} kg`],
    ["Förvaring", product.storage],
  ];

  return (
    <>
      <div className="container-page pt-5 md:pt-8">
        <Breadcrumbs items={[{ label: category!.name, href: `/kategori/${category!.slug}` }, { label: product.name }]} />

        <div className="mt-5 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-2 md:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="md:sticky md:top-40 md:self-start">
            <div className="relative mx-auto max-w-[260px] sm:max-w-sm md:max-w-none">
              <ProductImage product={product} rounded="rounded-3xl" padding="p-[12%]" />
              <ProductBadges product={product} className="absolute top-4 left-4 [&>span]:px-2.5 [&>span]:py-1 [&>span]:text-xs" />
            </div>
          </div>

          <div>
            <Link href={`/marke/${brand?.slug}`} className="text-xs font-semibold tracking-[0.1em] text-brand uppercase hover:underline">
              {brand?.name}
            </Link>
            <h1 className="mt-2 text-[30px] leading-[1.12] font-semibold md:text-[40px]">{product.name}</h1>
            <p className="mt-2 text-[17px] text-ink-soft">
              {packLabel(product)} <span className="text-muted">·</span> {product.unitsPerCarton} st per kartong
            </p>

            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex gap-1.5">
                <dt className="text-muted">Art.nr</dt>
                <dd className="font-medium tabular-nums">{product.articleNo}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-muted">EAN</dt>
                <dd className="font-medium tabular-nums">{product.ean}</dd>
              </div>
              <div>
                <StockStatus product={product} detailed className="text-sm" />
              </div>
            </dl>

            <div className="mt-6 rounded-3xl border border-line p-5 md:p-6">
              {!hydrated ? (
                <div className="h-36" />
              ) : loggedIn ? (
                <>
                  <PriceBlock product={product} size="lg" />
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                    <QuantityStepper value={qty} onChange={setQty} size="lg" className="w-full sm:w-40 sm:shrink-0 md:w-full lg:w-40" />
                    <button
                      type="button"
                      disabled={soldOut}
                      onClick={() => addToCart(product.articleNo, qty)}
                      className="btn btn-lg btn-primary flex-1"
                      data-testid="add-to-cart"
                    >
                      <ShoppingBag className="size-5" strokeWidth={1.9} />
                      {soldOut ? "Slut i lager" : "Lägg i varukorg"}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-ink-soft tabular-nums">
                    {qty} {qty === 1 ? "kartong" : "kartonger"} = {qty * product.unitsPerCarton} st · totalt {formatPrice(qty * currentPrice(product))} exkl. moms
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row md:flex-col xl:flex-row">
                    <SaveToList articleNo={product.articleNo} qty={qty} />
                    <FavoriteButton articleNo={product.articleNo} withLabel className="flex-1" />
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand">
                      <Lock className="size-[18px] text-ink-soft" />
                    </span>
                    <div>
                      <p className="font-semibold">Logga in för att se pris och beställa</p>
                      <p className="mt-0.5 text-sm text-ink-soft">Priser visas för godkända företagskunder. Ansök om konto på några minuter.</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <Link href="/logga-in" className="btn btn-dark">
                      Logga in
                    </Link>
                    <Link href="/bli-kund" className="btn btn-outline">
                      Bli kund
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <ul className="mt-5 space-y-3 text-sm text-ink-soft">
              <li className="flex gap-3">
                <Truck className="size-[18px] shrink-0 text-brand" strokeWidth={1.9} />
                <span>
                  <span className="font-semibold text-ink">Leverans inom {shopConfig.deliveryDays} arbetsdagar.</span> Fri frakt på order över{" "}
                  {shopConfig.freeShippingThreshold.toLocaleString("sv-SE")} kr.
                </span>
              </li>
              <li className="flex gap-3">
                <CalendarCheck className="size-[18px] shrink-0 text-brand" strokeWidth={1.9} />
                <span>
                  <span className="font-semibold text-ink">Minst {shopConfig.minBestBeforeMonths} månader kvar på bäst före</span> vid leverans.
                </span>
              </li>
              <li className="flex gap-3">
                <FileText className="size-[18px] shrink-0 text-brand" strokeWidth={1.9} />
                <span>
                  <span className="font-semibold text-ink">Betala mot faktura</span> med {shopConfig.invoiceDays} dagars betalningsvillkor.
                </span>
              </li>
            </ul>

            <div className="mt-8 border-t border-line pt-7">
              <h2 className="font-sans text-base font-semibold">Om produkten</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{product.description}</p>
              <h2 className="mt-7 font-sans text-base font-semibold">Produktfakta</h2>
              <dl className="mt-3 divide-y divide-line rounded-2xl border border-line">
                {facts.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              {product.offerPrice && loggedIn && (
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
                  <Check className="size-4 text-success" /> Kampanjpriset gäller så långt lagret räcker.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductRow title="Liknande produkter" href={`/kategori/${product.category}`} products={similarProducts(product, 5)} />
    </>
  );
}
