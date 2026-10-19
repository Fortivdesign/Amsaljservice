"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Heart, Mail, Phone, RotateCcw, Zap } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { buildInvoices } from "@/data/account";
import { formatAmount, formatDate, formatPrice } from "@/lib/format";
import { orderCartonCount, orderTotals } from "@/lib/order";
import { AccountHeading } from "./AccountShell";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function Overview() {
  const { user, orders, lists, favorites, addManyToCart, setCartOpen } = useShop();
  if (!user) return null;

  const invoices = buildInvoices(orders, shopConfig.vatRate);
  const unpaid = invoices.filter((i) => !i.paid);
  const unpaidSum = unpaid.reduce((s, i) => s + i.amount, 0);
  const nextDue = [...unpaid].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const last = orders[0];
  const creditLeft = user.creditLimit - unpaidSum;

  const reorder = (orderNo: string) => {
    const order = orders.find((o) => o.orderNo === orderNo);
    if (!order) return;
    addManyToCart(order.lines.map((l) => ({ articleNo: l.articleNo, qty: l.qty })), `Order ${orderNo} lagd i varukorgen`);
    setCartOpen(true);
  };

  const quick = [
    { href: "/mitt-konto/snabbbestallning", icon: Zap, title: "Snabbbeställning", text: "Skriv artikelnummer och antal" },
    { href: "/mitt-konto/inkopslistor", icon: ClipboardList, title: "Inköpslistor", text: `${lists.length} sparade listor` },
    { href: "/mitt-konto/favoriter", icon: Heart, title: "Favoriter", text: `${favorites.length} produkter` },
  ];

  return (
    <div>
      <AccountHeading title={`Hej ${user.contact.split(" ")[0]}`} text={`Översikt för ${user.company}.`} />

      <div className="mt-7 grid gap-3 sm:grid-cols-3 md:gap-4">
        <div className="card p-5">
          <p className="text-sm text-ink-soft">Senaste order</p>
          {last && (
            <>
              <p className="mt-1.5 flex items-center gap-2.5">
                <span className="font-display text-2xl font-semibold tabular-nums">{last.orderNo}</span>
                <OrderStatusBadge status={last.status} />
              </p>
              <p className="mt-1 text-sm text-muted">
                {formatDate(last.date)} · {formatPrice(orderTotals(last).subtotal)}
              </p>
            </>
          )}
          <Link href="/mitt-konto/ordrar" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
            Alla ordrar <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink-soft">Obetalda fakturor</p>
          <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums">{formatAmount(unpaidSum)}</p>
          <p className="mt-1 text-sm text-muted">
            {unpaid.length} fakturor{nextDue ? ` · nästa förfaller ${formatDate(nextDue.dueDate)}` : ""}
          </p>
          <Link href="/mitt-konto/fakturor" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
            Till fakturor <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink-soft">Tillgänglig kredit</p>
          <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums">{formatAmount(creditLeft)}</p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-ink" style={{ width: `${(unpaidSum / user.creditLimit) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">Kreditgräns {formatAmount(user.creditLimit)}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 md:px-6">
            <h2 className="text-lg font-semibold">Senaste ordrar</h2>
            <Link href="/mitt-konto/ordrar" className="text-sm font-semibold">
              Visa alla
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {orders.slice(0, 4).map((o) => (
              <li key={o.orderNo} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 md:px-6">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2.5 font-semibold">
                    <span className="tabular-nums">Order {o.orderNo}</span>
                    <OrderStatusBadge status={o.status} />
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {formatDate(o.date)} · {o.lines.length} artiklar · {orderCartonCount(o)} kartonger
                  </p>
                </div>
                <span className="text-[15px] font-semibold tabular-nums">{formatPrice(orderTotals(o).subtotal)}</span>
                <button type="button" onClick={() => reorder(o.orderNo)} className="btn btn-sm btn-outline">
                  <RotateCcw className="size-3.5" /> Beställ igen
                </button>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-4">
          <div className="grid gap-2">
            {quick.map(({ href, icon: Icon, title, text }) => (
              <Link key={href} href={href} className="group flex items-center gap-3.5 rounded-2xl border border-line p-4 transition-colors hover:border-line-strong">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                  <Icon className="size-[18px]" strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-sm text-muted">{text}</span>
                </span>
                <ArrowRight className="size-4 text-ink-soft transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
          <div className="rounded-2xl bg-sand p-5">
            <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Din säljare</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-ink font-display font-semibold text-white">
                {user.salesRep.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <p className="font-semibold">{user.salesRep.name}</p>
                <p className="text-sm text-ink-soft">AM Säljservice</p>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
              <Phone className="size-4" /> {user.salesRep.phone}
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft">
              <Mail className="size-4" /> {user.salesRep.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
