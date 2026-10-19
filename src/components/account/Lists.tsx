"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ClipboardList, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { currentPrice, getProduct, packLabel } from "@/data/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { ProductImage } from "../ProductImage";
import { AccountHeading } from "./AccountShell";

export function Lists() {
  const { lists, createList, removeFromList, addManyToCart, setCartOpen } = useShop();
  const [name, setName] = useState("");
  const [open, setOpen] = useState<string | null>(lists[0]?.id ?? null);

  return (
    <div>
      <AccountHeading title="Inköpslistor" text="Spara varor du beställer ofta och lägg hela listan i varukorgen med ett klick." />

      <form
        className="mt-6 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          const id = createList(name.trim());
          setOpen(id);
          setName("");
        }}
      >
        <label htmlFor="new-list" className="sr-only">
          Namn på ny lista
        </label>
        <input id="new-list" value={name} onChange={(e) => setName(e.target.value)} placeholder="Namn på ny lista, till exempel Helgpåfyllning" className="field sm:max-w-sm" />
        <button type="submit" className="btn btn-dark">
          <Plus className="size-4" /> Skapa lista
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {lists.map((list) => {
          const isOpen = open === list.id;
          const total = list.items.reduce((s, i) => {
            const p = getProduct(i.articleNo);
            return s + (p ? currentPrice(p) * i.qty : 0);
          }, 0);
          return (
            <section key={list.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 p-5 md:p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                  <ClipboardList className="size-5" strokeWidth={1.9} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-sans text-[17px] font-semibold">{list.name}</h2>
                  <p className="text-sm text-muted">
                    {list.items.length} artiklar · {formatPrice(total)} exkl. moms · uppdaterad {formatDate(list.updated)}
                  </p>
                </div>
                <div className="flex w-full gap-2 sm:w-auto">
                  <button type="button" onClick={() => setOpen(isOpen ? null : list.id)} className="btn btn-sm btn-outline flex-1 sm:flex-none" aria-expanded={isOpen}>
                    {isOpen ? "Dölj" : "Visa varor"}
                    <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <button
                    type="button"
                    disabled={list.items.length === 0}
                    onClick={() => {
                      addManyToCart(list.items, `${list.name} lagd i varukorgen`);
                      setCartOpen(true);
                    }}
                    className="btn btn-sm btn-primary flex-1 sm:flex-none"
                  >
                    <ShoppingBag className="size-4" /> Lägg allt i varukorg
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-line px-5 md:px-6">
                  {list.items.length === 0 ? (
                    <p className="py-6 text-sm text-ink-soft">
                      Listan är tom. Spara varor från en{" "}
                      <Link href="/sortiment" className="link">
                        produktsida
                      </Link>
                      .
                    </p>
                  ) : (
                    <ul className="divide-y divide-line">
                      {list.items.map((item) => {
                        const p = getProduct(item.articleNo);
                        if (!p) return null;
                        return (
                          <li key={item.articleNo} className="flex items-center gap-3 py-3">
                            <div className="w-11 shrink-0">
                              <ProductImage product={p} rounded="rounded-lg" padding="p-0.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link href={`/produkt/${p.slug}`} className="block truncate text-sm font-semibold hover:underline">
                                {p.name}
                              </Link>
                              <p className="text-xs text-muted">
                                {packLabel(p)} · Art.nr {p.articleNo}
                              </p>
                            </div>
                            <span className="text-sm tabular-nums">{item.qty} krt</span>
                            <span className="hidden w-28 text-right text-sm font-semibold tabular-nums sm:block">{formatPrice(currentPrice(p) * item.qty)}</span>
                            <button
                              type="button"
                              onClick={() => removeFromList(list.id, item.articleNo)}
                              aria-label={`Ta bort ${p.name} från listan`}
                              className="grid size-9 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
