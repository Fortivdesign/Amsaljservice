"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { shopConfig } from "@/config/shop";
import { deliveryDateIfOrderedNow } from "@/lib/time";
import { useNow } from "../useNow";

const weekdays = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];

/** Två stora bildbanners: latinohörna och snabb leverans. */
export function PromoBanners() {
  const now = useNow(60000);
  const day = now ? weekdays[deliveryDateIfOrderedNow(now).getDay()] : "";

  return (
    <section className="container-page mt-16 grid gap-4 md:mt-24 lg:grid-cols-2" data-testid="promo-banners">
      <Link href="/bli-kund" className="group relative isolate flex min-h-[420px] overflow-hidden rounded-[32px] bg-teal md:min-h-[460px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/bilder/fruktstand.jpg"
          alt="Fruktstånd på en latinamerikansk marknad"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-teal via-teal/60 to-transparent" />
        <div className="mt-auto p-7 text-white md:p-10">
          <p className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold tracking-[0.12em] text-teal uppercase">Gratis hjälp</p>
          <h3 className="mt-4 font-poster text-[40px] leading-[1.25] tracking-wide uppercase md:text-[54px]">
            Starta ett
            <br />
            latino-hörn
          </h3>
          <p className="mt-3 max-w-sm text-white/90">Din säljare tar fram de 20 storsäljarna som passar just din butik och dina kunder.</p>
          <span className="btn mt-6 bg-white text-ink group-hover:bg-sun">
            Få ett gratis förslag <ArrowRight className="size-4" />
          </span>
        </div>
      </Link>

      <Link href="/kundservice#leverans" className="group relative isolate flex min-h-[420px] overflow-hidden rounded-[32px] bg-ink md:min-h-[460px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/bilder/lastkaj.jpg"
          alt="Kartonger vid en gul lastkaj"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
        <div className="mt-auto p-7 text-white md:p-10">
          <p className="inline-block rounded-full bg-sun px-3 py-1 text-xs font-bold tracking-[0.12em] text-ink uppercase">Snabb leverans</p>
          <h3 className="mt-4 font-poster text-[40px] leading-[1.25] tracking-wide uppercase md:text-[54px]">
            Beställ i dag,
            <br />
            <span className="text-sun">på hyllan {day || "snart"}</span>
          </h3>
          <p className="mt-3 max-w-sm text-white/90">
            Vi plockar och skickar din order direkt. Fri frakt när du handlar för minst {shopConfig.freeShippingThreshold.toLocaleString("sv-SE")} kr.
          </p>
          <span className="btn mt-6 bg-sun text-ink group-hover:bg-white">
            Så funkar leveransen <ArrowRight className="size-4" />
          </span>
        </div>
      </Link>
    </section>
  );
}
