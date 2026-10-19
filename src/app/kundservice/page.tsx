import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { shopConfig } from "@/config/shop";

export const metadata: Metadata = { title: "Kundservice" };

const threshold = shopConfig.freeShippingThreshold.toLocaleString("sv-SE");

const sections = [
  {
    id: "leverans",
    title: "Leverans och frakt",
    body: [
      `Vi plockar och packar din order inom ${shopConfig.pickingTime} och levererar normalt inom ${shopConfig.deliveryDays} arbetsdagar.`,
      `Fri frakt gäller standardleverans på order över ${threshold} kr exklusive moms. Under beloppet kostar standardleverans ${shopConfig.shippingOptions[0].price} kr.`,
      "När ordern lämnar lagret skickar vi en spårningslänk till din e-post.",
    ],
  },
  {
    id: "betalning",
    title: "Betalning och faktura",
    body: [
      `Godkända företagskunder betalar mot faktura med ${shopConfig.invoiceDays} dagars betalningsvillkor. Fakturan skickas som PDF till fakturamejlen.`,
      "Du kan också betala med kort i kassan. Alla fakturor finns att ladda ner under Mitt konto.",
    ],
  },
  {
    id: "bast-fore",
    title: "Bäst före och kvalitet",
    body: [
      `Alla varor har minst ${shopConfig.minBestBeforeMonths} månader kvar på bäst före när de levereras, om inget annat anges på produkten.`,
      "Vi lagrar varorna torrt och tempererat och följer leverantörernas förvaringsanvisningar.",
    ],
  },
  {
    id: "reklamation",
    title: "Reklamation",
    body: [
      "Kontrollera leveransen när den kommer. Skadat gods anmäler du till oss inom 2 arbetsdagar, gärna med bild.",
      "Ångerrätt gäller inte för livsmedel, men hör av dig så hittar vi en lösning.",
    ],
  },
];

export default function CustomerServicePage() {
  return (
    <div className="container-page pt-5 md:pt-8">
      <Breadcrumbs items={[{ label: "Kundservice" }]} />
      <div className="mt-5 grid gap-10 md:mt-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
        <div>
          <h1 className="text-[32px] leading-tight font-semibold md:text-[44px]">Kundservice</h1>
          <p className="mt-2 max-w-2xl text-ink-soft md:text-[17px]">Här hittar du det viktigaste om leverans, betalning och kvalitet.</p>
          <div className="mt-8 space-y-4">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="card scroll-mt-40 p-6 md:p-8">
                <h2 className="text-xl font-semibold">{s.title}</h2>
                <div className="mt-3 space-y-2.5 text-ink-soft">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <aside id="kontakt" className="scroll-mt-40 lg:pt-[120px]">
          <div className="rounded-3xl bg-sand p-6 md:p-8 lg:sticky lg:top-40">
            <h2 className="text-xl font-semibold">Kontakta oss</h2>
            <p className="mt-1 text-sm text-ink-soft">{shopConfig.contact.hours}</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li className="flex items-center gap-3">
                <Phone className="size-[18px] text-brand" /> {shopConfig.contact.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-[18px] text-brand" /> {shopConfig.contact.email}
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-[18px] text-brand" /> {shopConfig.contact.address}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
