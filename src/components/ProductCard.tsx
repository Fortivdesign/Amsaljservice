"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { currentPrice, getBrand, packLabel, unitPrice, type Product } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { FavoriteButton } from "./FavoriteButton";
import { QuantityStepper } from "./QuantityStepper";
import { StockStatus } from "./StockStatus";
import { ProductBadges } from "./Badges";

export function PriceBlock({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const price = currentPrice(product);
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className={`font-display font-semibold tracking-tight tabular-nums ${product.offerPrice ? "text-brand" : "text-ink"} ${size === "lg" ? "text-3xl" : "text-[19px]"}`}>
          {formatPrice(price)}
        </span>
        <span className="text-xs text-muted">/krt</span>
        {product.offerPrice ? <span className="text-sm text-muted tabular-nums line-through">{formatPrice(product.price)}</span> : null}
      </div>
      <p className={`text-muted tabular-nums ${size === "lg" ? "mt-1 text-sm" : "text-xs"}`}>
        {formatPrice(unitPrice(product))}/st · exkl. moms
      </p>
    </div>
  );
}

export function LoginForPrice({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/logga-in"
      className={`flex items-center justify-center gap-1.5 rounded-xl bg-sand px-2.5 py-2.5 text-center text-[12.5px] leading-snug font-semibold text-ink transition-colors hover:bg-cream ${className}`}
    >
      <Lock className="size-3.5 shrink-0" strokeWidth={2.2} />
      Logga in för att se pris
    </Link>
  );
}

export function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  const { user, hydrated, addToCart } = useShop();
  const [qty, setQty] = useState(1);
  const brand = getBrand(product.brand);
  const soldOut = product.stock === "slut";

  return (
    <article
      className={`group @container relative flex h-full flex-col rounded-2xl border border-line bg-white p-2.5 transition-shadow duration-200 hover:shadow-soft sm:p-3 ${className}`}
      data-testid="product-card"
    >
      <Link href={`/produkt/${product.slug}`} className="relative block" tabIndex={-1} aria-hidden>
        <ProductImage product={product} />
        <ProductBadges product={product} className="absolute top-2 left-2" />
      </Link>
      <FavoriteButton articleNo={product.articleNo} className="absolute top-4 right-4 sm:top-5 sm:right-5" />

      <div className="mt-3 flex flex-1 flex-col px-0.5">
        <Link href={`/marke/${brand?.slug}`} className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase hover:text-ink">
          {brand?.name}
        </Link>
        <h3 className="mt-0.5 font-sans text-[15px] leading-snug font-semibold tracking-normal">
          <Link href={`/produkt/${product.slug}`} className="line-clamp-2 hover:underline hover:decoration-line-strong hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-[13px] text-ink-soft">{packLabel(product)}</p>
        <StockStatus product={product} className="mt-1.5" />

        <div className="mt-auto pt-3">
          {!hydrated ? (
            <div className="h-[42px] rounded-xl bg-sand" />
          ) : !user ? (
            <LoginForPrice />
          ) : (
            <div>
              <PriceBlock product={product} />
              <div className="mt-3 flex flex-col gap-2 @[15.5rem]:flex-row">
                <QuantityStepper value={qty} onChange={setQty} size="sm" className="w-full @[15.5rem]:w-[6.5rem] @[15.5rem]:shrink-0" />
                <button
                  type="button"
                  disabled={soldOut}
                  onClick={() => {
                    addToCart(product.articleNo, qty);
                    setQty(1);
                  }}
                  className="btn btn-sm btn-primary w-full px-3 @[15.5rem]:flex-1"
                >
                  <ShoppingBag className="size-4" strokeWidth={2} />
                  {soldOut ? "Slut i lager" : "Lägg i varukorg"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
