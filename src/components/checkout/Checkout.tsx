"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, CreditCard, FileText, Lock, MapPin, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { buildInvoices } from "@/data/account";
import { addDays, addWorkdays, daysAgo, formatAmount, formatDate, formatPrice, formatWeekday } from "@/lib/format";
import { cartCount, cartLines, cartSubtotal, shippingCost, totals } from "@/lib/order";
import { FreeShippingMeter } from "../FreeShippingMeter";
import { SummaryLines, TotalsTable } from "./OrderSummary";

type Step = 1 | 2 | 3;

function StepCard({
  step,
  current,
  title,
  icon,
  summary,
  onEdit,
  children,
  innerRef,
}: {
  step: Step;
  current: Step;
  title: string;
  icon: ReactNode;
  summary?: ReactNode;
  onEdit: () => void;
  children: ReactNode;
  innerRef?: React.Ref<HTMLElement>;
}) {
  const done = current > step;
  const active = current === step;
  return (
    <section
      ref={innerRef}
      className={`min-w-0 scroll-mt-36 rounded-3xl border bg-white transition-shadow md:scroll-mt-40 ${active ? "border-line-strong shadow-soft" : "border-line"}`}
      data-testid={`checkout-step-${step}`}
      aria-current={active ? "step" : undefined}
    >
      <header className="flex items-center gap-3.5 px-5 py-5 md:px-7">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
            done ? "bg-success text-white" : active ? "bg-ink text-white" : "bg-sand text-muted"
          }`}
        >
          {done ? <Check className="size-4" strokeWidth={3} /> : step}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={`flex items-center gap-2 font-display text-lg font-semibold md:text-xl ${!active && !done ? "text-muted" : ""}`}>
            {title}
            <span className="hidden text-muted sm:inline">{icon}</span>
          </h2>
          {done && summary && <div className="mt-0.5 truncate text-sm text-ink-soft">{summary}</div>}
        </div>
        {done && (
          <button type="button" onClick={onEdit} className="shrink-0 text-sm font-semibold text-ink underline underline-offset-4">
            Ändra
          </button>
        )}
      </header>
      {active && <div className="border-t border-line px-5 pt-6 pb-6 md:px-7 md:pb-7">{children}</div>}
    </section>
  );
}

function RadioCard({ checked, onSelect, children, testId }: { checked: boolean; onSelect: () => void; children: ReactNode; testId?: string }) {
  return (
    <label
      data-testid={testId}
      className={`flex cursor-pointer gap-3.5 rounded-2xl border p-4 transition-colors md:p-5 ${checked ? "border-ink bg-sand/60 ring-1 ring-ink" : "border-line hover:border-line-strong"}`}
    >
      <input type="radio" checked={checked} onChange={onSelect} className="peer sr-only" />
      <span
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 ${checked ? "border-ink" : "border-line-strong"}`}
      >
        {checked && <span className="size-2.5 rounded-full bg-ink" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  optional,
  hint,
  className = "",
  placeholder,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
  hint?: string;
  className?: string;
  placeholder?: string;
  testId?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-zåäö]+/g, "-");
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="font-normal text-muted"> (valfritt)</span>}
      </label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} required={!optional} placeholder={placeholder} className="field" data-testid={testId} />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function Checkout() {
  const router = useRouter();
  const { user, hydrated, cart, orders, placeOrder } = useShop();
  const [step, setStep] = useState<Step>(1);
  const [addressId, setAddressId] = useState("butik");
  const [addr, setAddr] = useState({ name: "", street: "", zip: "", city: "", contact: "", phone: "", note: "" });
  const [shippingId, setShippingId] = useState("standard");
  const [payment, setPayment] = useState<"faktura" | "kort">("faktura");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const stepRefs = [useRef<HTMLElement>(null), useRef<HTMLElement>(null), useRef<HTMLElement>(null)];
  const prevStep = useRef<Step>(1);

  // Förifyll leveransadressen från kontot
  useEffect(() => {
    if (!user) return;
    const a = user.addresses.find((x) => x.id === addressId) ?? user.addresses[0];
    setAddr({ name: a.name, street: a.street, zip: a.zip, city: a.city, contact: user.contact, phone: user.phone, note: a.note ?? "" });
  }, [user, addressId]);

  // Visa aktivt steg när man går vidare
  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    // I frakt-steget syns även det avklarade adressteget ovanför
    const target = step === 2 ? stepRefs[0] : stepRefs[step - 1];
    target.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const lines = useMemo(() => cartLines(cart), [cart]);
  const subtotal = cartSubtotal(cart);
  const ship = step >= 2 ? shippingCost(shippingId, subtotal) : null;
  const t = totals(subtotal, ship ?? 0);
  const option = shopConfig.shippingOptions.find((o) => o.id === shippingId)!;
  const unpaid = useMemo(() => buildInvoices(orders, shopConfig.vatRate).filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0), [orders]);

  if (!hydrated || placing) {
    return <div className="container-page min-h-[60vh] pt-10" />;
  }

  if (!user) {
    return (
      <div className="container-page pt-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-sand">
          <Lock className="size-6 text-ink-soft" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold">Logga in för att gå till kassan</h1>
        <p className="mt-2 text-ink-soft">Kassan är öppen för godkända företagskunder.</p>
        <Link href="/logga-in" className="btn btn-lg btn-dark mt-7">
          Logga in
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page pt-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-sand">
          <ShoppingBag className="size-6 text-ink-soft" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold">Varukorgen är tom</h1>
        <p className="mt-2 text-ink-soft">Lägg till kartonger innan du går till kassan.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/sortiment" className="btn btn-lg btn-dark">
            Se sortimentet
          </Link>
          <Link href="/mitt-konto/snabbbestallning" className="btn btn-lg btn-outline">
            Snabbbeställning
          </Link>
        </div>
      </div>
    );
  }

  const today = daysAgo(0);
  const eta = (workdays: number) => formatWeekday(addWorkdays(today, workdays));
  const dueDate = formatDate(addDays(today, shopConfig.invoiceDays + 1));

  const submit = () => {
    setPlacing(true);
    const order = placeOrder({ shippingId, addressId, payment, reference });
    router.push(`/kassa/bekraftelse?order=${order.orderNo}`);
  };

  const summaryCard = (
    <div className="rounded-3xl border border-line bg-white p-5 md:p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold">Din order</h2>
        <span className="text-sm text-muted">
          {lines.length} artiklar · {cartCount(cart)} krt
        </span>
      </div>
      <div className="mt-2 max-h-[340px] overflow-y-auto">
        <SummaryLines lines={lines} />
      </div>
      <div className="mt-3 border-t border-line pt-4">
        <TotalsTable subtotal={subtotal} shipping={ship} vat={t.vat} total={t.total} />
      </div>
      {subtotal < shopConfig.freeShippingThreshold && <FreeShippingMeter subtotal={subtotal} className="mt-5" />}
    </div>
  );

  return (
    <div className="container-page pt-5 md:pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Kassa</p>
          <h1 className="mt-1.5 text-[30px] leading-tight font-semibold md:text-[40px]">Slutför din order</h1>
        </div>
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <ShieldCheck className="size-4 text-success" /> Inloggad som {user.company}
        </p>
      </div>

      {/* Ordersammanfattning överst på mobil */}
      <div className="mt-5 rounded-2xl bg-sand lg:hidden">
        <button type="button" onClick={() => setSummaryOpen(!summaryOpen)} className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            {summaryOpen ? "Dölj ordersammanfattning" : "Visa ordersammanfattning"}
            <ChevronDown className={`size-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
          </span>
          <span className="tabular-nums">{formatPrice(t.total)}</span>
        </button>
        {summaryOpen && <div className="px-2 pb-2">{summaryCard}</div>}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
        <div className="space-y-4">
          <StepCard
            step={1}
            current={step}
            title="Leveransadress"
            icon={<MapPin className="size-[18px]" />}
            onEdit={() => setStep(1)}
            innerRef={stepRefs[0]}
            summary={`${addr.name}, ${addr.street}, ${addr.zip} ${addr.city}`}
          >
            <p className="text-sm text-ink-soft">Förifylld från ditt konto. Välj en sparad adress eller ändra för den här ordern.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {user.addresses.map((a) => (
                <RadioCard key={a.id} checked={addressId === a.id} onSelect={() => setAddressId(a.id)} testId={`address-${a.id}`}>
                  <span className="block text-[15px] font-semibold">{a.label}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">
                    {a.name}
                    <br />
                    {a.street}, {a.zip} {a.city}
                  </span>
                </RadioCard>
              ))}
            </div>
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <TextField label="Mottagare" value={addr.name} onChange={(v) => setAddr({ ...addr, name: v })} className="sm:col-span-2" />
              <TextField label="Gatuadress" value={addr.street} onChange={(v) => setAddr({ ...addr, street: v })} className="sm:col-span-2" />
              <TextField label="Postnummer" value={addr.zip} onChange={(v) => setAddr({ ...addr, zip: v })} />
              <TextField label="Ort" value={addr.city} onChange={(v) => setAddr({ ...addr, city: v })} />
              <TextField label="Kontaktperson" value={addr.contact} onChange={(v) => setAddr({ ...addr, contact: v })} />
              <TextField label="Telefon vid leverans" value={addr.phone} onChange={(v) => setAddr({ ...addr, phone: v })} />
              <TextField
                label="Leveransinstruktioner"
                value={addr.note}
                onChange={(v) => setAddr({ ...addr, note: v })}
                optional
                placeholder="Portkod, lossning, öppettider"
                className="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-lg btn-dark w-full sm:w-auto" data-testid="to-shipping">
                  Fortsätt till frakt
                </button>
              </div>
            </form>
          </StepCard>

          <StepCard
            step={2}
            current={step}
            title="Frakt"
            icon={<Truck className="size-[18px]" />}
            onEdit={() => setStep(2)}
            innerRef={stepRefs[1]}
            summary={`${option.name}, ${ship === 0 ? "0 kr" : formatAmount(ship ?? option.price)} · ${option.etaLabel.toLowerCase()} ${eta(option.workdays)}`}
          >
            <div className="grid gap-3">
              {shopConfig.shippingOptions.map((o) => {
                const cost = shippingCost(o.id, subtotal);
                const freeByThreshold = o.freeAboveThreshold && cost === 0;
                return (
                  <RadioCard key={o.id} checked={shippingId === o.id} onSelect={() => setShippingId(o.id)} testId={`shipping-${o.id}`}>
                    <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <span>
                        <span className="block text-[15px] font-semibold">{o.name}</span>
                        <span className="block text-sm text-ink-soft">{o.description}</span>
                        <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-success">
                          <Truck className="size-3.5" /> {o.etaLabel} {eta(o.workdays)}
                        </span>
                      </span>
                      <span className="text-right">
                        {freeByThreshold ? (
                          <>
                            <span className="block font-semibold text-success">Fri frakt</span>
                            <span className="block text-xs text-muted line-through tabular-nums">{formatPrice(o.price)}</span>
                          </>
                        ) : (
                          <span className="block font-semibold tabular-nums">{cost === 0 ? "Kostnadsfritt" : formatPrice(cost)}</span>
                        )}
                      </span>
                    </span>
                  </RadioCard>
                );
              })}
            </div>
            {subtotal < shopConfig.freeShippingThreshold && <FreeShippingMeter subtotal={subtotal} className="mt-4 lg:hidden" />}
            <button type="button" onClick={() => setStep(3)} className="btn btn-lg btn-dark mt-6 w-full sm:w-auto" data-testid="to-payment">
              Fortsätt till betalning
            </button>
          </StepCard>

          <StepCard step={3} current={step} title="Betalning" icon={<FileText className="size-[18px]" />} onEdit={() => setStep(3)} innerRef={stepRefs[2]}>
            <div className="grid gap-3">
              <RadioCard checked={payment === "faktura"} onSelect={() => setPayment("faktura")} testId="payment-invoice">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-semibold">Faktura {shopConfig.invoiceDays} dagar</span>
                  <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success">Förvald</span>
                </span>
                <span className="mt-1 block text-sm text-ink-soft">
                  Fakturan skickas som PDF till <span className="font-medium text-ink">{user.invoiceEmail}</span>. Förfaller cirka {dueDate}.
                </span>
                <span className="mt-2 block text-sm text-ink-soft">
                  Tillgänglig kredit: <span className="font-semibold text-ink tabular-nums">{formatAmount(user.creditLimit - unpaid)}</span>
                </span>
              </RadioCard>
              <p className="pt-2 text-xs font-semibold tracking-[0.06em] text-muted uppercase">Andra betalsätt</p>
              <RadioCard checked={payment === "kort"} onSelect={() => setPayment("kort")} testId="payment-card">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-[15px] font-semibold">
                    <CreditCard className="size-[18px]" strokeWidth={1.8} /> Kortbetalning
                  </span>
                  <span className="flex gap-1.5">
                    <span className="rounded-md border border-line px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-ink-soft">VISA</span>
                    <span className="rounded-md border border-line px-1.5 py-0.5 text-[11px] font-bold text-ink-soft">Mastercard</span>
                  </span>
                </span>
                <span className="mt-1 block text-sm text-ink-soft">Betala direkt med företagskort. Du skickas vidare till en säker betalsida.</span>
              </RadioCard>
            </div>

            <div className="mt-6 grid gap-4">
              <TextField
                label="Egen referens eller inköpsnummer"
                value={reference}
                onChange={setReference}
                optional
                placeholder="Till exempel PO 2026-118"
                hint="Visas på fakturan och följesedeln."
                testId="reference"
              />
              <div>
                <label htmlFor="message" className="field-label">
                  Meddelande till lagret <span className="font-normal text-muted">(valfritt)</span>
                </label>
                <textarea id="message" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-none" />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-sand p-5 lg:hidden">
              <TotalsTable subtotal={subtotal} shipping={ship} vat={t.vat} total={t.total} shippingLabel={option.name} />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-soft sm:max-w-xs">Genom att lägga ordern godkänner du våra köpvillkor.</p>
              <button type="button" onClick={submit} className="btn btn-lg btn-primary w-full sm:w-auto sm:min-w-56" data-testid="place-order">
                Lägg order
              </button>
            </div>
          </StepCard>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-40">{summaryCard}</div>
        </aside>
      </div>
    </div>
  );
}
