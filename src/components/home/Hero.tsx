"use client";

import Link from "next/link";
import { ArrowRight, Check, Star, Truck } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { currentPrice, discountPercent, getProduct, packLabel } from "@/data/catalog";
import { formatPrice, formatWeekday } from "@/lib/format";
import { campaignEnd, deliveryDateIfOrderedNow, nextCutoff, splitDuration } from "@/lib/time";
import { ProductImage } from "../ProductImage";
import { Countdown } from "../CampaignBar";
import { useNow } from "../useNow";

/** "Beställ inom 3 tim 12 min så levereras det torsdag 22 oktober" */
export function DeliveryPromise({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const now = useNow(30000);
  if (!now) return <p className={`h-6 ${className}`} />;
  const left = splitDuration(nextCutoff(now).getTime() - now.getTime());
  const wait = left.days > 0 ? `${left.days} d ${left.hours} tim` : `${left.hours} tim ${left.minutes} min`;
  return (
    <p className={`flex items-center gap-2 text-sm ${tone === "light" ? "text-white/90" : "text-ink-soft"} ${className}`} data-testid="delivery-promise">
      <Truck className={`size-[18px] shrink-0 ${tone === "light" ? "text-sun" : "text-teal"}`} strokeWidth={2.2} />
      <span>
        Beställ inom <span className={`font-bold ${tone === "light" ? "text-sun" : "text-ink"}`}>{wait}</span>, leverans{" "}
        <span className="font-bold">{formatWeekday(deliveryDateIfOrderedNow(now))}</span>
      </span>
    </p>
  );
}

function DealCard() {
  const { user, hydrated } = useShop();
  const now = useNow();
  const deal = getProduct("10111")!;
  const pct = discountPercent(deal);
  return (
    <Link
      href={`/produkt/${deal.slug}`}
      className="group absolute right-6 bottom-8 hidden w-[290px] rotate-2 rounded-[28px] bg-white p-4 shadow-lift transition-transform hover:rotate-0 lg:block xl:right-[max(1.5rem,calc((100vw-1280px)/2+2rem))]"
      data-testid="hero-deal"
    >
      <span className="absolute -top-4 -left-4 grid size-20 -rotate-12 place-items-center rounded-full bg-sun text-center font-poster text-lg leading-[0.95] text-ink uppercase shadow-[3px_3px_0_0_rgb(28_18_48)]">
        Spara
        <br />
        {pct} %
      </span>
      <p className="text-right text-[11px] font-bold tracking-[0.14em] text-brand uppercase">Veckans deal</p>
      <div className="mt-2 flex items-center gap-3">
        <ProductImage product={deal} className="!w-24 shrink-0" rounded="rounded-2xl" padding="p-1" />
        <div className="min-w-0">
          <p className="font-bold leading-tight">{deal.name}</p>
          <p className="text-xs text-muted">{packLabel(deal)}</p>
          {hydrated && user ? (
            <p className="mt-1 font-poster text-xl text-brand">
              {formatPrice(currentPrice(deal))} <span className="font-sans text-xs text-muted line-through">{formatPrice(deal.price)}</span>
            </p>
          ) : (
            <p className="mt-1 text-xs font-bold text-ink">Logga in för kampanjpris</p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3 text-xs font-semibold">
        <span>Slutar om</span>
        <Countdown target={campaignEnd(now ?? new Date())} now={now} compact tone="dark" />
      </div>
    </Link>
  );
}

export function Hero() {
  const { user, hydrated, orders } = useShop();
  const loggedIn = hydrated && !!user;
  const { rating, reviewCount } = shopConfig.socialProof;
  const lastOrder = orders[0];

  return (
    <section className="relative bg-white lg:min-h-[640px] lg:bg-ink" data-testid="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/bilder/hero-gata.jpg"
        alt="Färgglada hus i en latinamerikansk gata"
        className="h-[260px] w-full object-cover object-[60%_center] sm:h-[340px] lg:absolute lg:inset-0 lg:h-full"
      />
      <div className="absolute inset-x-0 top-0 hidden h-full bg-gradient-to-r from-ink/45 via-ink/5 to-transparent lg:block" />

      <div className="container-page relative lg:flex lg:min-h-[640px] lg:items-center lg:py-14">
        <div
          className={`relative -mt-14 rounded-[32px] bg-ink px-6 pt-7 pb-8 text-white shadow-lift transition-opacity duration-200 sm:px-9 lg:mt-0 lg:w-[600px] lg:px-11 lg:pt-10 lg:pb-11 ${
            hydrated ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-white/85">
            <span className="flex text-sun">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" strokeWidth={0} />
              ))}
            </span>
            {rating.toLocaleString("sv-SE")} av 5 från {reviewCount} butiker
          </p>

          {loggedIn && user ? (
            <>
              <h1 className="mt-4 font-poster text-[46px] leading-[1.3] tracking-wide uppercase sm:text-[64px] lg:text-[72px]">
                Hej {user.contact.split(" ")[0]}!
                <br />
                <span className="text-sun">Fiesta-veckan</span>
                <br />
                är igång
              </h1>
              <p className="mt-5 max-w-md text-base text-white/80 md:text-[17px]">
                Spara upp till 13 % på Arizona, Postobón och Goya. {lastOrder ? `Din senaste order ${lastOrder.orderNo} har status ${lastOrder.status}.` : ""}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/erbjudanden" className="btn btn-lg btn-primary">
                  Handla kampanjerna <ArrowRight className="size-5" />
                </Link>
                <Link href="/mitt-konto/snabbbestallning" className="btn btn-lg border-2 border-white/25 text-white hover:border-white">
                  Snabbbeställning
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-4 font-poster text-[46px] leading-[0.97] tracking-wide uppercase sm:text-[64px] lg:text-[76px]">
                Smaken av
                <br />
                <span className="text-sun">Latinamerika</span>
                <br />
                till din butik
              </h1>
              <p className="mt-5 max-w-md text-base text-white/80 md:text-[17px]">
                Goya, Postobón, Saltín Noel, Monster och många fler storsäljare. Grossistpris per kartong, snabb leverans och faktura på {shopConfig.invoiceDays}{" "}
                dagar.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/bli-kund" className="btn btn-lg btn-primary" data-testid="hero-become-customer">
                  Bli kund på 2 minuter <ArrowRight className="size-5" />
                </Link>
                <Link href="/erbjudanden" className="btn btn-lg border-2 border-white/25 text-white hover:border-white">
                  Se veckans kampanjer
                </Link>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
                {["Ingen startavgift", "Rimliga grossistpriser", `Faktura ${shopConfig.invoiceDays} dagar`].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="size-4 text-sun" strokeWidth={3} /> {t}
                  </li>
                ))}
              </ul>
            </>
          )}
          <DeliveryPromise className="mt-6 border-t border-white/15 pt-5" />
        </div>
      </div>
      <DealCard />
    </section>
  );
}
