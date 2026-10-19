"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { SectionHeading } from "./SectionHeading";

const steps = [
  { n: "1", color: "bg-brand text-white", title: "Ansök på 2 minuter", text: "Fyll i företagsuppgifterna. Ingen startavgift och inga bindningstider." },
  { n: "2", color: "bg-sun text-ink", title: "Vi godkänner kontot", text: "Vi granskar ansökan och öppnar kontot, oftast samma arbetsdag." },
  { n: "3", color: "bg-teal text-white", title: "Beställ dygnet runt", text: `Se dina priser, beställ per kartong och få leverans inom ${shopConfig.deliveryDays} arbetsdagar.` },
];

/** "Så blir du kund" för besökare som inte är inloggade. */
export function HowItWorks() {
  const { user, hydrated } = useShop();
  if (hydrated && user) return null;
  return (
    <section className="mt-16 bg-cream py-14 md:mt-24 md:py-20">
      <div className="container-page">
        <SectionHeading kicker="Kom igång" title="Så enkelt blir du kund" />
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-[28px] border-2 border-ink bg-white p-6 shadow-pop md:p-7">
              <span className={`grid size-14 place-items-center rounded-2xl font-poster text-3xl ${s.color}`}>{s.n}</span>
              <h3 className="mt-5 font-poster text-2xl tracking-wide uppercase">{s.title}</h3>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/bli-kund" className="btn btn-lg btn-primary">
            Bli kund nu <ArrowRight className="size-5" />
          </Link>
          <p className="text-sm text-ink-soft">
            Redan kund?{" "}
            <Link href="/logga-in" className="link">
              Logga in här
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
