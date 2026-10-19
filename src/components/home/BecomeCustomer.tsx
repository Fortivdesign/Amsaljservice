"use client";

import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export function BecomeCustomer() {
  const { user, hydrated } = useShop();
  if (!hydrated || user) return null;
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="flex flex-col items-start gap-6 rounded-3xl bg-ink px-6 py-10 text-white sm:px-10 md:flex-row md:items-center md:justify-between md:px-14 md:py-12">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Driver du butik? Bli kund på några minuter.</h2>
          <p className="mt-2 text-white/70">Ansök om ett företagskonto så granskar vi uppgifterna och öppnar kontot, oftast inom en arbetsdag.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/bli-kund" className="btn btn-lg btn-primary">
            Bli kund
          </Link>
          <Link href="/logga-in" className="btn btn-lg border border-white/25 text-white hover:border-white">
            Logga in
          </Link>
        </div>
      </div>
    </section>
  );
}
