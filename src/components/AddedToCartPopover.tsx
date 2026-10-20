"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, PartyPopper, Truck, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { currentPrice, getBrand, getProduct, packLabel } from "@/data/catalog";
import { formatAmount, formatPrice } from "@/lib/format";
import { cartSubtotal, remainingForFreeShipping } from "@/lib/order";
import { ProductImage } from "./ProductImage";

const SHOW_MS = 7000;

function pctOf(amount: number) {
  return Math.min(100, Math.max(0, (amount / shopConfig.freeShippingThreshold) * 100));
}

/**
 * Rutan som fälls ut under varukorgsknappen när man lagt i en produkt.
 * Visar produkten och hur mycket som är kvar till fri frakt.
 */
export function AddedToCartPopover() {
  const { lastAdded, dismissLastAdded, cart, setCartOpen } = useShop();
  const pathname = usePathname();
  const timer = useRef<number | undefined>(undefined);

  const product = lastAdded ? getProduct(lastAdded.articleNo) : undefined;
  const subtotal = cartSubtotal(cart);
  const lineAmount = product && lastAdded ? currentPrice(product) * lastAdded.qty : 0;
  const remaining = remainingForFreeShipping(subtotal);
  const reached = remaining <= 0;

  // Mätaren växer från läget före tillägget till det nya läget
  const [shownPct, setShownPct] = useState(0);
  useEffect(() => {
    if (!lastAdded) return;
    setShownPct(pctOf(subtotal - lineAmount));
    const id = window.requestAnimationFrame(() => window.requestAnimationFrame(() => setShownPct(pctOf(subtotal))));
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAdded?.id]);

  const startTimer = (ms = SHOW_MS) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(dismissLastAdded, ms);
  };
  useEffect(() => {
    if (!lastAdded) return;
    startTimer();
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAdded?.id]);

  // Stäng när man byter sida
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname !== firstPath.current) {
      firstPath.current = pathname;
      dismissLastAdded();
    }
  }, [pathname, dismissLastAdded]);

  if (!lastAdded || !product) return null;
  const brand = getBrand(product.brand);

  return (
    <div
      key={lastAdded.id}
      role="status"
      aria-live="polite"
      data-testid="added-to-cart"
      onMouseEnter={() => window.clearTimeout(timer.current)}
      onMouseLeave={() => startTimer(2500)}
      className="animate-pop-in absolute top-full right-0 z-50 mt-3 w-[min(400px,calc(100vw-2rem))] origin-top-right rounded-3xl border-2 border-ink bg-white p-4 text-ink shadow-pop"
    >
      <span className="absolute -top-[9px] right-9 size-4 rotate-45 border-t-2 border-l-2 border-ink bg-white" aria-hidden />
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-bold">
          <CheckCircle2 className="size-5 text-leaf" strokeWidth={2.4} /> Tillagd i varukorgen
        </p>
        <button type="button" onClick={dismissLastAdded} aria-label="Stäng" className="-mr-1 grid size-8 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink">
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="w-16 shrink-0">
          <ProductImage product={product} rounded="rounded-xl" padding="p-1.5" />
        </div>
        <div className="min-w-0 flex-1">
          {brand && <p className="text-[11px] font-bold tracking-[0.08em] text-brand uppercase">{brand.name}</p>}
          <p className="truncate font-semibold">{product.name}</p>
          <p className="text-sm text-ink-soft">
            {lastAdded.qty} krt · {packLabel(product)}
          </p>
        </div>
        <p className="font-poster text-xl tabular-nums">{formatPrice(lineAmount)}</p>
      </div>

      <div className={`mt-3 rounded-2xl px-3.5 py-3 ${reached ? "bg-leaf-light" : "bg-sun-light"}`} data-testid="added-free-shipping">
        <p className="flex items-center gap-2 text-sm font-semibold">
          {reached ? (
            <>
              <PartyPopper className="size-[18px] shrink-0 text-leaf" strokeWidth={2.2} /> Snyggt! Du har fri frakt på ordern
            </>
          ) : (
            <>
              <Truck className="size-[18px] shrink-0 text-brand" strokeWidth={2.2} />
              <span>
                Bara <span className="font-extrabold text-brand tabular-nums">{formatAmount(remaining)}</span> kvar till fri frakt
              </span>
            </>
          )}
        </p>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pctOf(subtotal))}>
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${reached ? "bg-leaf" : "bg-gradient-to-r from-brand to-tangerine"}`}
            style={{ width: `${shownPct}%` }}
          />
        </div>
        <p className="mt-1.5 flex justify-between gap-2 text-[11px] font-medium text-ink-soft tabular-nums">
          <span>{formatAmount(subtotal)} i varukorgen</span>
          <span>Fri frakt vid {formatAmount(shopConfig.freeShippingThreshold)}</span>
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            dismissLastAdded();
            setCartOpen(true);
          }}
          className="btn btn-outline h-11"
        >
          Visa varukorg
        </button>
        <Link href="/kassa" onClick={dismissLastAdded} className="btn btn-primary h-11" data-testid="popover-checkout">
          Till kassan
        </Link>
      </div>
    </div>
  );
}
