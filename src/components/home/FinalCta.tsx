"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";

/** Avslutande uppmaning längst ner på startsidan. */
export function FinalCta() {
  const { user, hydrated } = useShop();
  const loggedIn = hydrated && !!user;
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-brand via-[#f0386b] to-tangerine px-6 py-12 text-white sm:px-10 md:px-14 md:py-16">
        <div className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-sun/30" aria-hidden />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-poster text-[42px] leading-[1.22] tracking-wide uppercase md:text-[64px]">
              {loggedIn ? "Dags att fylla på hyllorna?" : "Fyll hyllorna med det kunderna längtar efter"}
            </h2>
            <p className="mt-4 max-w-lg text-lg text-white/90">
              {loggedIn
                ? "Skriv in artikelnummer i snabbbeställningen eller beställ samma som förra gången med ett klick."
                : "Bli kund i dag och få grossistpriser på hela sortimentet. Vi hjälper dig gärna att komma igång."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            {loggedIn ? (
              <Link href="/mitt-konto/snabbbestallning" className="btn btn-lg bg-white text-ink hover:bg-sun">
                Till snabbbeställning <ArrowRight className="size-5" />
              </Link>
            ) : (
              <Link href="/bli-kund" className="btn btn-lg bg-white text-ink hover:bg-sun">
                Bli kund på 2 minuter <ArrowRight className="size-5" />
              </Link>
            )}
            <a href={`tel:${shopConfig.contact.phone.replace(/\s/g, "")}`} className="btn btn-lg border-2 border-white/40 text-white hover:border-white">
              <Phone className="size-5" /> {shopConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
