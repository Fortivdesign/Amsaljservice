"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import manifest from "@/data/asset-manifest.json";
import { useShop } from "@/context/ShopContext";
import { getBrand, getProduct, packLabel, products } from "@/data/catalog";
import { shopConfig } from "@/config/shop";
import { formatPrice } from "@/lib/format";
import { currentPrice } from "@/data/catalog";
import { orderStatusLabel } from "@/data/account";
import { ProductImage } from "../ProductImage";
import { PackPlaceholder } from "../PackPlaceholder";

function HeroVisual() {
  if (manifest.hero) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={manifest.hero} alt="Hylla med läsk i en butik" className="absolute inset-0 h-full w-full object-cover object-[center_40%]" />;
  }
  // Reserv om ingen bild finns i assets: ett lugnt "hyllmotiv" av platshållare
  const picks = products.filter((p) => p.topSeller).slice(0, 6);
  return (
    <div className="absolute inset-0 grid grid-cols-3 content-center gap-4 bg-cream p-8">
      {picks.map((p) => (
        <div key={p.articleNo} className="rounded-2xl bg-white/60 p-3">
          <PackPlaceholder shape={p.shape} label={getBrand(p.brand)?.name} />
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const { user, hydrated, orders } = useShop();
  const featured = getProduct("10107")!;
  const loggedIn = hydrated && !!user;
  const lastOrder = orders[0];

  return (
    <section className="container-page pt-4 md:pt-8">
      <div className="grid overflow-hidden rounded-[28px] bg-cream md:min-h-[540px] md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="relative order-1 h-60 sm:h-72 md:order-2 md:h-auto">
          <HeroVisual />
          <Link
            href={`/produkt/${featured.slug}`}
            className="absolute bottom-4 left-4 hidden items-center gap-3 rounded-2xl sm:flex bg-white/95 p-2.5 pr-4 shadow-soft backdrop-blur transition hover:bg-white sm:right-auto sm:max-w-xs md:bottom-6 md:left-6"
          >
            <ProductImage product={featured} className="!w-14 shrink-0" rounded="rounded-xl" padding="p-1" />
            <span className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold tracking-[0.08em] text-brand uppercase">Nyhet i sortimentet</span>
              <span className="block truncate text-sm font-semibold text-ink">{featured.name}</span>
              <span className="block text-xs text-muted">
                {packLabel(featured)}
                {loggedIn && <> · {formatPrice(currentPrice(featured))}/krt</>}
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-ink-soft" />
          </Link>
        </div>

        <div className={`order-2 flex flex-col justify-center px-6 py-8 transition-opacity duration-200 sm:px-10 md:order-1 md:py-12 lg:px-14 ${hydrated ? "opacity-100" : "opacity-0"}`}>
          {loggedIn && user ? (
            <>
              <p className="eyebrow">{user.company}</p>
              <h1 className="mt-3 text-[34px] leading-[1.08] font-semibold sm:text-5xl lg:text-[54px]">Välkommen tillbaka, {user.contact.split(" ")[0]}</h1>
              <p className="mt-5 max-w-lg text-base text-ink-soft md:text-lg">
                {lastOrder ? (
                  <>
                    Din senaste order <span className="font-semibold text-ink">{lastOrder.orderNo}</span> har status{" "}
                    <span className="font-semibold text-ink">{orderStatusLabel[lastOrder.status].toLowerCase()}</span>. Beställ som vanligt i sortimentet eller
                    skriv in artikelnummer direkt i snabbbeställningen.
                  </>
                ) : (
                  "Beställ som vanligt i sortimentet eller skriv in artikelnummer direkt i snabbbeställningen."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/mitt-konto/snabbbestallning" className="btn btn-lg btn-primary">
                  Snabbbeställning
                </Link>
                <Link href="/mitt-konto/ordrar" className="btn btn-lg btn-outline">
                  Beställ igen
                </Link>
              </div>
              <p className="mt-6 text-sm text-ink-soft">
                Kundnummer {user.customerNo} · Faktura {shopConfig.invoiceDays} dagar · Din säljare {user.salesRep.name}
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow">Grossist för butiker i hela Sverige</p>
              <h1 className="mt-3 text-[34px] leading-[1.08] font-semibold sm:text-5xl lg:text-[54px]">
                Latinamerikanska och amerikanska favoriter till din butik
              </h1>
              <p className="mt-5 max-w-lg text-base text-ink-soft md:text-lg">
                Vi säljer livsmedel och dryck per kartong till butiker, kiosker och restauranger. Bli kund för att se priser och beställa direkt i webbshoppen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/bli-kund" className="btn btn-lg btn-primary" data-testid="hero-become-customer">
                  Bli kund
                </Link>
                <Link href="/sortiment" className="btn btn-lg btn-outline">
                  Se sortimentet
                </Link>
              </div>
              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand" strokeWidth={2.4} /> Faktura {shopConfig.invoiceDays} dagar
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand" strokeWidth={2.4} /> Leverans inom {shopConfig.deliveryDays} arbetsdagar
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
