"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BadgeCheck, Check, Eye, EyeOff, FileText, Sparkles, Tag, Truck, UserRound } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { Breadcrumbs } from "./Breadcrumbs";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  hint,
  autoComplete,
  required = true,
  className = "",
  inputMode,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  defaultValue?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="field-label">
        {label}
        {!required && <span className="font-normal text-muted"> (valfritt)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        inputMode={inputMode}
        defaultValue={defaultValue}
        className="field"
      />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function Section({ step, title, text, children }: { step: number; title: string; text?: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-7 first:border-t-0 first:pt-0">
      <legend className="contents">
        <span className="flex items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{step}</span>
          <span className="font-display text-lg font-semibold">{title}</span>
        </span>
      </legend>
      {text && <p className="mt-1.5 pl-10 text-sm text-ink-soft">{text}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

const benefits = [
  { icon: Tag, title: "Priser direkt i webbshoppen", text: "Se dina priser per kartong och per styck dygnet runt." },
  { icon: FileText, title: `Faktura ${shopConfig.invoiceDays} dagar`, text: "Handla mot faktura efter godkänd kreditprövning." },
  { icon: Truck, title: `Leverans inom ${shopConfig.deliveryDays} arbetsdagar`, text: "Vi levererar till butiken eller ditt lager." },
  { icon: UserRound, title: "Personlig säljare", text: "En kontaktperson som känner din butik och ditt sortiment." },
];

export function RegisterForm() {
  const router = useRouter();
  const { submitApplication } = useShop();
  const [otherDelivery, setOtherDelivery] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);
  const [offer, setOffer] = useState<{ code: string; email: string } | null>(null);

  // Rabattkod och e-post från välkomstpopupen
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("rabatt");
    if (code) setOffer({ code, email: params.get("epost") ?? "" });
  }, []);

  return (
    <div className="container-page pt-5 md:pt-8">
      <Breadcrumbs items={[{ label: "Bli kund" }]} />
      <div className="mt-5 grid gap-10 md:mt-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        <div>
          <p className="eyebrow">Företagskonto</p>
          <h1 className="mt-2 text-[32px] leading-tight font-semibold md:text-[44px]">Bli kund hos AM Säljservice</h1>
          <p className="mt-2 max-w-2xl text-ink-soft md:text-[17px]">
            Fyll i uppgifterna om ditt företag. Vi granskar ansökan och öppnar kontot, oftast inom en arbetsdag.
          </p>

          {offer && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-sun px-5 py-4 text-ink" data-testid="offer-banner">
              <Sparkles className="size-5 shrink-0" />
              <p className="text-sm">
                <span className="font-bold">{shopConfig.welcomeOffer.percent} % rabatt på första ordern är reserverad åt dig.</span> Koden {offer.code} skickas när kontot
                är godkänt.
              </p>
            </div>
          )}
          <form
            key={offer?.email ?? "form"}
            className="card mt-8 space-y-7 p-5 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setSending(true);
              submitApplication({
                company: String(data.get("company") || ""),
                contact: String(data.get("contact") || ""),
                email: String(data.get("email") || ""),
              });
              router.push("/bli-kund/tack");
            }}
            data-testid="register-form"
          >
            <Section step={1} title="Företaget">
              <Field label="Företagsnamn" name="company" placeholder="Butiken AB" autoComplete="organization" />
              <Field label="Organisationsnummer" name="orgnr" placeholder="556677-8899" inputMode="numeric" hint="10 siffror" />
            </Section>

            <Section step={2} title="Kontaktperson">
              <Field label="Namn" name="contact" placeholder="För- och efternamn" autoComplete="name" className="sm:col-span-2" />
              <Field
                label="E-post"
                name="email"
                type="email"
                placeholder="namn@foretag.se"
                autoComplete="email"
                hint="Används för inloggning och orderbekräftelser"
                defaultValue={offer?.email}
              />
              <Field label="Mobilnummer" name="phone" type="tel" placeholder="070 123 45 67" autoComplete="tel" />
            </Section>

            <Section step={3} title="Fakturering" text="Fakturor skickas som PDF till fakturamejlen.">
              <Field label="Fakturamejl" name="invoiceEmail" type="email" placeholder="faktura@foretag.se" className="sm:col-span-2" />
              <Field label="Fakturaadress" name="street" placeholder="Gatuadress" autoComplete="street-address" className="sm:col-span-2" />
              <Field label="Postnummer" name="zip" placeholder="123 45" inputMode="numeric" autoComplete="postal-code" />
              <Field label="Ort" name="city" placeholder="Ort" autoComplete="address-level2" />
            </Section>

            <Section step={4} title="Leverans">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 sm:col-span-2">
                <input type="checkbox" checked={otherDelivery} onChange={(e) => setOtherDelivery(e.target.checked)} className="peer sr-only" />
                <span
                  className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[5px] border peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 ${
                    otherDelivery ? "border-ink bg-ink text-white" : "border-line-strong"
                  }`}
                >
                  {otherDelivery && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span>
                  <span className="block text-[15px] font-medium">Leverera till en annan adress</span>
                  <span className="block text-sm text-ink-soft">Valfritt. Annars levererar vi till fakturaadressen.</span>
                </span>
              </label>
              {otherDelivery && (
                <>
                  <Field label="Leveransadress" name="deliveryStreet" placeholder="Gatuadress" className="sm:col-span-2" />
                  <Field label="Postnummer" name="deliveryZip" placeholder="123 45" inputMode="numeric" />
                  <Field label="Ort" name="deliveryCity" placeholder="Ort" />
                </>
              )}
            </Section>

            <Section step={5} title="Inloggning">
              <div className="sm:col-span-2">
                <label htmlFor="password" className="field-label">
                  Välj lösenord
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Minst 8 tecken"
                    className="field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
                    className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-sand"
                  >
                    {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                  </button>
                </div>
                <p className="field-hint">Du kan logga in när kontot är godkänt.</p>
              </div>
            </Section>

            <div className="flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-sm text-ink-soft">
                Genom att skicka ansökan godkänner du våra <span className="link">köpvillkor</span> och att vi gör en kreditupplysning på företaget.
              </p>
              <button type="submit" disabled={sending} className="btn btn-lg btn-primary shrink-0" data-testid="register-submit">
                Skicka ansökan
              </button>
            </div>
          </form>
        </div>

        <aside className="lg:pt-[148px]">
          <div className="rounded-3xl bg-sand p-6 md:p-8 lg:sticky lg:top-40">
            <h2 className="text-xl font-semibold">Fördelar som kund</h2>
            <ul className="mt-5 space-y-5">
              {benefits.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-brand">
                    <Icon className="size-[18px]" strokeWidth={1.9} />
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="block text-sm text-ink-soft">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white p-4 text-sm">
              <BadgeCheck className="size-5 shrink-0 text-success" />
              <span className="text-ink-soft">
                Redan kund?{" "}
                <Link href="/logga-in" className="link">
                  Logga in här
                </Link>
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
