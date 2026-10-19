"use client";

import Link from "next/link";
import { Check, Clock3, Mail, Phone } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";

export function ApplicationReceived() {
  const { application, hydrated } = useShop();
  const company = application?.company || "ditt företag";
  const email = application?.email || "din e-post";

  const steps = [
    { title: "Ansökan mottagen", text: "Vi har tagit emot uppgifterna.", state: "done" as const },
    { title: "Vi granskar företaget", text: "Vi kontrollerar organisationsnummer och gör en kreditupplysning.", state: "active" as const },
    { title: "Kontot godkänns", text: `Du får ett mejl till ${email} och kan logga in och se priser.`, state: "todo" as const },
  ];

  return (
    <div className="container-page pt-10 md:pt-16">
      <div className={`mx-auto max-w-2xl transition-opacity ${hydrated ? "opacity-100" : "opacity-0"}`}>
        <div className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-50 text-brand">
            <Clock3 className="size-8" strokeWidth={1.7} />
          </span>
          <p className="eyebrow mt-6">Tack för din ansökan</p>
          <h1 className="mt-2 text-[30px] leading-tight font-semibold md:text-[42px]">Kontot granskas och godkänns</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft md:text-[17px]">
            Vi går igenom uppgifterna för <span className="font-semibold text-ink">{company}</span>. Det tar oftast mindre än en arbetsdag. Du får ett mejl så fort
            kontot är aktiverat.
          </p>
        </div>

        <ol className="card mt-10 p-6 md:p-8" data-testid="review-steps">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-4 pb-7 last:pb-0">
              {i < steps.length - 1 && <span className="absolute top-9 bottom-1 left-[17px] w-px bg-line" aria-hidden />}
              <span
                className={`relative grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                  s.state === "done" ? "bg-success text-white" : s.state === "active" ? "bg-brand text-white ring-4 ring-brand-100" : "bg-sand text-muted"
                }`}
              >
                {s.state === "done" ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <div className="pt-1.5">
                <p className="font-semibold">
                  {s.title}
                  {s.state === "active" && <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand">Pågår</span>}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-3 rounded-2xl bg-sand p-5 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-2.5 text-ink-soft">
            <Phone className="size-4 text-brand" /> {shopConfig.contact.phone}
          </p>
          <p className="flex items-center gap-2.5 text-ink-soft">
            <Mail className="size-4 text-brand" /> {shopConfig.contact.email}
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-lg btn-dark">
            Till startsidan
          </Link>
          <Link href="/sortiment" className="btn btn-lg btn-outline">
            Titta på sortimentet
          </Link>
        </div>
      </div>
    </div>
  );
}
