"use client";

import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Lock, ShoppingBag, Trash2, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getBrand, packLabel } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { cartCount, cartLines, cartSubtotal } from "@/lib/order";
import { ProductImage } from "./ProductImage";
import { QuantityStepper } from "./QuantityStepper";
import { FreeShippingMeter } from "./FreeShippingMeter";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, user } = useShop();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const lines = cartLines(cart);
  const subtotal = cartSubtotal(cart);
  const count = cartCount(cart);
  const close = () => setCartOpen(false);

  return createPortal(
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Varukorg" data-testid="cart-drawer">
      <div className="animate-fade-in absolute inset-0 bg-ink/40" onClick={close} />
      <aside className="animate-slide-in-right absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white shadow-lift">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="text-lg font-semibold">
            Varukorg {count > 0 && <span className="font-sans text-sm font-normal text-muted">({count} kartonger)</span>}
          </h2>
          <button type="button" onClick={close} aria-label="Stäng varukorgen" className="grid size-10 place-items-center rounded-full hover:bg-sand">
            <X className="size-5" />
          </button>
        </div>

        {!user ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-sand">
              <Lock className="size-6 text-ink-soft" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold">Logga in för att handla</p>
            <p className="mt-1 text-sm text-ink-soft">Priser och varukorg visas när du är inloggad med ditt företagskonto.</p>
            <Link href="/logga-in" onClick={close} className="btn btn-dark mt-6 w-full">
              Logga in
            </Link>
            <Link href="/bli-kund" onClick={close} className="btn btn-outline mt-2 w-full">
              Bli kund
            </Link>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-sand">
              <ShoppingBag className="size-6 text-ink-soft" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold">Varukorgen är tom</p>
            <p className="mt-1 text-sm text-ink-soft">Lägg till kartonger från sortimentet eller använd snabbbeställning.</p>
            <Link href="/sortiment" onClick={close} className="btn btn-dark mt-6 w-full">
              Se sortimentet
            </Link>
            <Link href="/mitt-konto/snabbbestallning" onClick={close} className="btn btn-outline mt-2 w-full">
              Snabbbeställning
            </Link>
          </div>
        ) : (
          <>
            <div className="shrink-0 px-5 pt-4">
              <FreeShippingMeter subtotal={subtotal} />
            </div>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map(({ product, qty, price, total }) => (
                <li key={product.articleNo} className="flex gap-3.5 py-4">
                  <Link href={`/produkt/${product.slug}`} onClick={close} className="w-[76px] shrink-0">
                    <ProductImage product={product} rounded="rounded-lg" padding="p-1.5" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{getBrand(product.brand)?.name}</p>
                        <Link href={`/produkt/${product.slug}`} onClick={close} className="line-clamp-2 text-sm leading-snug font-semibold hover:underline">
                          {product.name}
                        </Link>
                        <p className="text-xs text-muted">
                          {packLabel(product)} · {formatPrice(price)}/krt
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.articleNo)}
                        aria-label={`Ta bort ${product.name}`}
                        className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <QuantityStepper value={qty} onChange={(v) => setQty(product.articleNo, v)} size="sm" className="w-[7.25rem]" />
                      <span className="text-[15px] font-semibold tabular-nums">{formatPrice(total)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="shrink-0 border-t border-line bg-white px-5 pt-4 pb-5">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">Delsumma exkl. moms</span>
                <span className="font-display text-xl font-semibold tabular-nums" data-testid="cart-subtotal">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">Frakt och moms räknas fram i kassan.</p>
              <Link href="/kassa" onClick={close} className="btn btn-lg btn-primary mt-4 w-full" data-testid="checkout-button">
                Till kassan
              </Link>
              <button type="button" onClick={close} className="mt-2 w-full py-2 text-sm font-medium text-ink-soft hover:text-ink">
                Fortsätt handla
              </button>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body,
  );
}
