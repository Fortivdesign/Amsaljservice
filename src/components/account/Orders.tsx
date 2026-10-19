"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ExternalLink, RotateCcw } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import type { Order, OrderStatus } from "@/data/account";
import { getProduct, packLabel } from "@/data/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { orderCartonCount, orderTotals } from "@/lib/order";
import { ProductImage } from "../ProductImage";
import { AccountHeading } from "./AccountShell";
import { OrderProgress, OrderStatusBadge } from "./OrderStatusBadge";

function OrderCard({ order, defaultOpen }: { order: Order; defaultOpen: boolean }) {
  const { user, addManyToCart, setCartOpen, showToast } = useShop();
  const [open, setOpen] = useState(defaultOpen);
  const t = orderTotals(order);
  const address = user?.addresses.find((a) => a.id === order.addressId);
  const shipping = shopConfig.shippingOptions.find((o) => o.id === order.shippingId);
  const products = order.lines.map((l) => getProduct(l.articleNo)).filter((p) => !!p);

  const reorder = () => {
    addManyToCart(
      order.lines.map((l) => ({ articleNo: l.articleNo, qty: l.qty })),
      `Order ${order.orderNo} lagd i varukorgen`,
    );
    setCartOpen(true);
  };

  return (
    <article className="card overflow-hidden" data-testid="order-card">
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex flex-wrap items-center gap-2.5 font-sans text-[17px] font-semibold">
              <span className="tabular-nums">Order {order.orderNo}</span>
              <OrderStatusBadge status={order.status} />
            </h2>
            <p className="mt-1 text-sm text-muted">
              {formatDate(order.date)} · {order.lines.length} artiklar · {orderCartonCount(order)} kartonger
              {order.reference ? ` · Ref: ${order.reference}` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-semibold tabular-nums">{formatPrice(t.subtotal)}</p>
            <p className="text-xs text-muted">exkl. moms</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <OrderProgress status={order.status} />
          <div className="flex -space-x-2">
            {products.slice(0, 4).map((p) => (
              <div key={p!.articleNo} className="w-10 rounded-lg ring-2 ring-white">
                <ProductImage product={p!} rounded="rounded-lg" padding="p-0.5" />
              </div>
            ))}
            {products.length > 4 && (
              <span className="grid size-10 place-items-center rounded-lg bg-sand text-xs font-semibold ring-2 ring-white">+{products.length - 4}</span>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={reorder} className="btn btn-sm btn-primary" data-testid="reorder">
            <RotateCcw className="size-3.5" strokeWidth={2.2} /> Beställ igen
          </button>
          <button type="button" onClick={() => setOpen(!open)} className="btn btn-sm btn-outline" aria-expanded={open}>
            {open ? "Dölj detaljer" : "Visa detaljer"}
            <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {order.status === "skickad" && order.trackingNo && (
            <button
              type="button"
              onClick={() => showToast({ message: "Spårningen öppnas hos transportören", detail: `Kollinummer ${order.trackingNo}` })}
              className="btn btn-sm btn-ghost"
            >
              <ExternalLink className="size-3.5" /> Spåra leverans
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-sand/50 px-5 py-5 md:px-6">
          <div className="hidden grid-cols-[minmax(0,1fr)_80px_110px_110px] gap-4 pb-2 text-xs font-semibold tracking-wide text-muted uppercase sm:grid">
            <span>Produkt</span>
            <span className="text-right">Antal</span>
            <span className="text-right">Pris/krt</span>
            <span className="text-right">Summa</span>
          </div>
          <ul className="divide-y divide-line">
            {order.lines.map((l) => {
              const p = getProduct(l.articleNo);
              if (!p) return null;
              return (
                <li key={l.articleNo} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3 sm:grid-cols-[minmax(0,1fr)_80px_110px_110px]">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="w-11 shrink-0">
                      <ProductImage product={p} rounded="rounded-lg" padding="p-0.5" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/produkt/${p.slug}`} className="block truncate text-sm font-semibold hover:underline">
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted">
                        {packLabel(p)} · Art.nr {p.articleNo}
                      </p>
                    </div>
                  </div>
                  <span className="text-right text-sm tabular-nums sm:block">
                    <span className="sm:hidden">{l.qty} krt · </span>
                    <span className="hidden sm:inline">{l.qty}</span>
                  </span>
                  <span className="hidden text-right text-sm text-ink-soft tabular-nums sm:block">{formatPrice(l.price)}</span>
                  <span className="col-span-2 text-right text-sm font-semibold tabular-nums sm:col-span-1">{formatPrice(l.qty * l.price)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 grid gap-4 border-t border-line pt-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted">Leveransadress</p>
              <p className="mt-0.5 font-medium">
                {address?.name}, {address?.street}, {address?.city}
              </p>
            </div>
            <div>
              <p className="text-muted">Frakt</p>
              <p className="mt-0.5 font-medium">
                {shipping?.name} · {t.shipping === 0 ? "0 kr" : formatPrice(t.shipping)}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-muted">Totalt inkl. moms</p>
              <p className="mt-0.5 font-semibold tabular-nums">{formatPrice(t.total)}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

const filters: { key: "alla" | OrderStatus; label: string }[] = [
  { key: "alla", label: "Alla" },
  { key: "mottagen", label: "Mottagen" },
  { key: "packas", label: "Packas" },
  { key: "skickad", label: "Skickad" },
];

export function Orders() {
  const { orders } = useShop();
  const [filter, setFilter] = useState<"alla" | OrderStatus>("alla");
  const list = filter === "alla" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <AccountHeading title="Ordrar" text="Följ status på dina ordrar och beställ samma varor igen med ett klick." />
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f.key === "alla" ? orders.length : orders.filter((o) => o.status === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${filter === f.key ? "bg-ink text-white" : "bg-sand text-ink-soft hover:text-ink"}`}
            >
              {f.label} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 space-y-4">
        {list.map((o) => (
          <OrderCard key={o.orderNo} order={o} defaultOpen={false} />
        ))}
        {list.length === 0 && <p className="rounded-2xl bg-sand px-6 py-10 text-center text-ink-soft">Inga ordrar med den statusen.</p>}
      </div>
    </div>
  );
}
