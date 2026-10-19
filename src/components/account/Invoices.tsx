"use client";

import { Download } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { buildInvoices, type Invoice } from "@/data/account";
import { daysAgo, formatAmount, formatDate, formatPrice } from "@/lib/format";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import { AccountHeading } from "./AccountShell";

function daysUntil(date: string) {
  return Math.round((new Date(date).getTime() - new Date(daysAgo(0)).getTime()) / 86400000);
}

function InvoiceStatus({ invoice }: { invoice: Invoice }) {
  if (invoice.paid) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success">
        <span className="size-1.5 rounded-full bg-current" /> Betald
      </span>
    );
  }
  const d = daysUntil(invoice.dueDate);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-semibold text-warning">
      <span className="size-1.5 rounded-full bg-current" /> Obetald, {d <= 0 ? "förfaller i dag" : `förfaller om ${d} dagar`}
    </span>
  );
}

export function Invoices() {
  const { user, orders } = useShop();
  if (!user) return null;
  const invoices = buildInvoices(orders, shopConfig.vatRate);
  const unpaid = invoices.filter((i) => !i.paid);
  const unpaidSum = unpaid.reduce((s, i) => s + i.amount, 0);
  const nextDue = [...unpaid].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  const download = (inv: Invoice) => {
    const order = orders.find((o) => o.orderNo === inv.orderNo);
    if (order) downloadInvoicePdf(inv, order, user);
  };

  return (
    <div>
      <AccountHeading title="Fakturor" text={`Fakturor skickas till ${user.invoiceEmail}. Här kan du ladda ner dem som PDF.`} />

      <div className="mt-7 grid gap-3 sm:grid-cols-3 md:gap-4">
        <div className="card p-5">
          <p className="text-sm text-ink-soft">Att betala</p>
          <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums">{formatAmount(unpaidSum)}</p>
          <p className="mt-1 text-sm text-muted">{unpaid.length} obetalda fakturor</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink-soft">Förfaller närmast</p>
          <p className="mt-1.5 font-display text-2xl font-semibold">{nextDue ? formatDate(nextDue.dueDate) : "Inget"}</p>
          <p className="mt-1 text-sm text-muted">{nextDue ? `Faktura ${nextDue.invoiceNo}, ${formatAmount(nextDue.amount)}` : "Allt är betalt"}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink-soft">Betala till</p>
          <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums">Bg 5555-1234</p>
          <p className="mt-1 text-sm text-muted">Ange fakturanumret som OCR</p>
        </div>
      </div>

      <section className="card mt-6 overflow-hidden" data-testid="invoice-table">
        <table className="hidden w-full text-left text-sm md:table">
          <thead className="border-b border-line bg-sand/60 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-5 py-3 font-semibold">Faktura</th>
              <th className="px-3 py-3 font-semibold">Order</th>
              <th className="px-3 py-3 font-semibold">Fakturadatum</th>
              <th className="px-3 py-3 font-semibold">Förfallodatum</th>
              <th className="px-3 py-3 text-right font-semibold">Belopp</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {invoices.map((inv) => (
              <tr key={inv.invoiceNo}>
                <td className="px-5 py-4 font-semibold tabular-nums">{inv.invoiceNo}</td>
                <td className="px-3 py-4 text-ink-soft tabular-nums">{inv.orderNo}</td>
                <td className="px-3 py-4 text-ink-soft">{formatDate(inv.date)}</td>
                <td className="px-3 py-4 text-ink-soft">{formatDate(inv.dueDate)}</td>
                <td className="px-3 py-4 text-right font-semibold tabular-nums">{formatPrice(inv.amount)}</td>
                <td className="px-3 py-4">
                  <InvoiceStatus invoice={inv} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button type="button" onClick={() => download(inv)} className="btn btn-sm btn-outline" data-testid="download-invoice">
                    <Download className="size-4" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="divide-y divide-line md:hidden">
          {invoices.map((inv) => (
            <li key={inv.invoiceNo} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold tabular-nums">Faktura {inv.invoiceNo}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    Order {inv.orderNo} · {formatDate(inv.date)}
                  </p>
                </div>
                <p className="font-semibold tabular-nums">{formatPrice(inv.amount)}</p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <InvoiceStatus invoice={inv} />
                <button type="button" onClick={() => download(inv)} className="btn btn-sm btn-outline">
                  <Download className="size-4" /> PDF
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-4 text-sm text-muted">Belopp inklusive moms. Fakturor skapas när ordern har skickats.</p>
    </div>
  );
}
