import { CalendarCheck, FileText, PackageCheck, Truck } from "lucide-react";
import { shopConfig } from "@/config/shop";
import { formatAmount } from "@/lib/format";

export const trustItems = [
  {
    icon: FileText,
    title: "Betala mot faktura",
    text: `${shopConfig.invoiceDays} dagars betalningsvillkor för godkända företagskunder.`,
  },
  {
    icon: Truck,
    title: "Snabb leverans",
    text: `Vi plockar inom ett dygn och levererar inom ${shopConfig.deliveryDays} arbetsdagar.`,
  },
  {
    icon: CalendarCheck,
    title: `Minst ${shopConfig.minBestBeforeMonths} månader på bäst före`,
    text: "Alla varor har minst så lång hållbarhet kvar när de levereras.",
  },
  {
    icon: PackageCheck,
    title: `Fri frakt över ${formatAmount(shopConfig.freeShippingThreshold)}`,
    text: "Gäller standardleverans till butik, beloppet räknas exklusive moms.",
  },
];

export function TrustRow() {
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4 bg-white p-6 lg:flex-col lg:gap-5 lg:p-7">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
              <Icon className="size-5" strokeWidth={1.9} />
            </span>
            <div>
              <h3 className="font-sans text-[15px] font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
