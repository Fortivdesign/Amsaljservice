"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { categories } from "@/data/catalog";
import { shopConfig } from "@/config/shop";
import { useShop } from "@/context/ShopContext";
import { Logo } from "./Logo";

export function Footer() {
  const { resetDemo } = useShop();
  const year = 2026;

  return (
    <footer className="mt-20 bg-ink text-white/75 md:mt-28">
      <div className="container-page grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
        <div>
          <div className="h-20">
            <Logo variant="light" />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Grossist inom latinamerikansk mat och amerikansk dryck. Vi levererar per kartong till butiker i hela Sverige.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-brand-200" /> {shopConfig.contact.phone}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-brand-200" /> {shopConfig.contact.email}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-brand-200" /> {shopConfig.contact.address}
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Sortiment</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/marken" className="hover:text-white">
                Alla märken
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Kundservice</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/kundservice#leverans" className="hover:text-white">
                Leverans och frakt
              </Link>
            </li>
            <li>
              <Link href="/kundservice#betalning" className="hover:text-white">
                Betalning och faktura
              </Link>
            </li>
            <li>
              <Link href="/kundservice#bast-fore" className="hover:text-white">
                Bäst före och kvalitet
              </Link>
            </li>
            <li>
              <Link href="/kundservice#reklamation" className="hover:text-white">
                Reklamation
              </Link>
            </li>
            <li>
              <Link href="/kundservice#kontakt" className="hover:text-white">
                Kontakta oss
              </Link>
            </li>
          </ul>
          <p className="mt-5 text-sm">{shopConfig.contact.hours}</p>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Företagskund</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/bli-kund" className="hover:text-white">
                Bli kund
              </Link>
            </li>
            <li>
              <Link href="/logga-in" className="hover:text-white">
                Logga in
              </Link>
            </li>
            <li>
              <Link href="/mitt-konto/ordrar" className="hover:text-white">
                Orderhistorik
              </Link>
            </li>
            <li>
              <Link href="/mitt-konto/snabbbestallning" className="hover:text-white">
                Snabbbeställning
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {shopConfig.companyName} · Org.nr {shopConfig.contact.orgNr} · Alla priser visas exklusive moms
          </p>
          <button type="button" onClick={resetDemo} className="self-start text-white/40 underline-offset-4 hover:text-white/80 hover:underline md:self-auto">
            Återställ demo
          </button>
        </div>
      </div>
    </footer>
  );
}
