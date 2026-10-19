"use client";

import Link from "next/link";
import { Check, FileText, Mail, PackageOpen, Truck } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { getProduct } from "@/data/catalog";
import { addWorkdays, formatDateLong, formatWeekday } from "@/lib/format";
import { orderTotals, type CartLine } from "@/lib/order";
import { SummaryLines, TotalsTable } from "./OrderSummary";

export function OrderConfirmation({ orderNo }: { orderNo?: string }) {
  const { orders, user, hydrated } = useShop();
  if (!hydrated) return <div className="min-h-[60vh]" />;

  const order = orders.find((o) => o.orderNo === orderNo) ?? orders[0];
  if (!order || !user) {
    return (
      <div className="container-page pt-16 text-center">
        <h1 className="text-3xl font-semibold">Ingen order att visa</h1>
        <Link href="/" className="btn btn-dark mt-6">
          Till startsidan
        </Link>
      </div>
    );
  }

  const address = user.addresses.find((a) => a.id === order.addressId) ?? user.addresses[0];
  const option = shopConfig.shippingOptions.find((o) => o.id === order.shippingId) ?? shopConfig.shippingOptions[0];
  const t = orderTotals(order);
  const lines: CartLine[] = order.lines.flatMap((l) => {
    const product = getProduct(l.articleNo);
    return product ? [{ product, qty: l.qty, price: l.price, total: l.qty * l.price }] : [];
  });

  const next = [
    { icon: Mail, title: "Orderbekräftelse på mejl", text: `Vi har skickat en bekräftelse till ${user.email}.`, done: true },
    { icon: PackageOpen, title: `Plockas inom ${shopConfig.pickingTime}`, text: "Vi plockar och packar din order på vårt lager.", done: false },
    { icon: Truck, title: "Spårningslänk på mejl", text: `När ordern lämnar lagret får du en länk för att följa leveransen. ${option.etaLabel} ${formatWeekday(addWorkdays(order.date, option.workdays))}.`, done: false },
    { icon: FileText, title: `Faktura ${shopConfig.invoiceDays} dagar`, text: `Fakturan skickas till ${user.invoiceEmail} när ordern har skickats.`, done: false },
  ];

  return (
    <div className="container-page pt-8 md:pt-14">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-success text-white">
            <Check className="size-8" strokeWidth={2.6} />
          </span>
          <h1 className="mt-6 text-[32px] leading-tight font-semibold md:text-[44px]">Tack för din order!</h1>
          <p className="mt-2 text-ink-soft md:text-[17px]">Vi har tagit emot ordern och börjar plocka den direkt.</p>
          <div className="mx-auto mt-6 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl bg-sand px-6 py-4">
            <span className="text-sm text-ink-soft">Ordernummer</span>
            <span className="font-display text-2xl font-semibold tracking-wide tabular-nums" data-testid="order-number">
              {order.orderNo}
            </span>
            <span className="text-sm text-ink-soft">{formatDateLong(order.date)}</span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <section className="card p-6 md:p-7">
            <h2 className="text-xl font-semibold">Vad händer nu?</h2>
            <ol className="mt-5">
              {next.map(({ icon: Icon, title, text, done }, i) => (
                <li key={title} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < next.length - 1 && <span className="absolute top-10 bottom-1 left-[19px] w-px bg-line" aria-hidden />}
                  <span className={`relative grid size-10 shrink-0 place-items-center rounded-full ${done ? "bg-success-50 text-success" : "bg-sand text-ink-soft"}`}>
                    <Icon className="size-[18px]" strokeWidth={1.9} />
                  </span>
                  <div className="pt-1">
                    <p className="font-semibold">{title}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="card p-6 md:p-7">
            <h2 className="text-xl font-semibold">Ordersammanfattning</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">Leveransadress</dt>
                <dd className="mt-0.5 font-medium">
                  {address.name}
                  <br />
                  {address.street}, {address.zip} {address.city}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Frakt</dt>
                <dd className="mt-0.5 font-medium">{option.name}</dd>
              </div>
              <div>
                <dt className="text-muted">Betalning</dt>
                <dd className="mt-0.5 font-medium">{order.payment === "faktura" ? `Faktura ${shopConfig.invoiceDays} dagar` : "Kort"}</dd>
              </div>
              <div>
                <dt className="text-muted">Er referens</dt>
                <dd className="mt-0.5 font-medium">{order.reference ?? "Ingen angiven"}</dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-line">
              <SummaryLines lines={lines} />
            </div>
            <div className="mt-2 border-t border-line pt-4">
              <TotalsTable subtotal={t.subtotal} shipping={t.shipping} vat={t.vat} total={t.total} />
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-lg btn-primary" data-testid="continue-shopping">
            Fortsätt handla
          </Link>
          <Link href="/mitt-konto/ordrar" className="btn btn-lg btn-outline">
            Se orderhistorik
          </Link>
        </div>
      </div>
    </div>
  );
}
