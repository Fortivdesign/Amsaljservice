import { CalendarCheck, FileText, PackageCheck, Truck } from "lucide-react";
import { shopConfig } from "@/config/shop";
import { formatAmount } from "@/lib/format";

const items = [
  {
    icon: FileText,
    color: "bg-teal-light",
    iconColor: "bg-teal text-white",
    title: "Betala mot faktura",
    text: `${shopConfig.invoiceDays} dagars betalningsvillkor för godkända företagskunder.`,
  },
  {
    icon: Truck,
    color: "bg-sun-light",
    iconColor: "bg-sun text-ink",
    title: "Snabb leverans",
    text: `Vi skickar direkt och levererar inom ${shopConfig.deliveryDays} arbetsdagar.`,
  },
  {
    icon: CalendarCheck,
    color: "bg-leaf-light",
    iconColor: "bg-leaf text-white",
    title: `Minst ${shopConfig.minBestBeforeMonths} månader på bäst före`,
    text: "Alla varor har minst så lång hållbarhet kvar när de kommer fram.",
  },
  {
    icon: PackageCheck,
    color: "bg-rose-light",
    iconColor: "bg-brand text-white",
    title: `Fri frakt över ${formatAmount(shopConfig.freeShippingThreshold)}`,
    text: "Gäller standardleverans till butik, beloppet räknas exklusive moms.",
  },
];

export function UspGrid() {
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {items.map(({ icon: Icon, color, iconColor, title, text }) => (
          <div key={title} className={`flex gap-4 rounded-[28px] p-6 lg:flex-col lg:p-7 ${color}`}>
            <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${iconColor}`}>
              <Icon className="size-6" strokeWidth={2} />
            </span>
            <div>
              <h3 className="font-sans text-base font-bold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
