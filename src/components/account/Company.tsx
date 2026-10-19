"use client";

import type { ReactNode } from "react";
import { MapPin, Plus, UserPlus } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { formatAmount } from "@/lib/format";
import { AccountHeading } from "./AccountShell";

function InfoCard({ title, rows, onEdit }: { title: string; rows: [string, ReactNode][]; onEdit: () => void }) {
  return (
    <section className="card p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-base font-semibold">{title}</h2>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline">
          Ändra
        </button>
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[130px_minmax(0,1fr)] gap-3">
            <dt className="text-muted">{k}</dt>
            <dd className="font-medium break-words">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Company() {
  const { user, showToast } = useShop();
  if (!user) return null;
  const requestChange = () => showToast({ message: "Tack! Vi har tagit emot din ändring", detail: `${user.salesRep.name} återkommer inom en arbetsdag.` });

  return (
    <div>
      <AccountHeading title="Företag och adresser" text="Uppgifter om företaget, fakturering och leveransadresser." />

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <InfoCard
          title="Företagsuppgifter"
          onEdit={requestChange}
          rows={[
            ["Företagsnamn", user.company],
            ["Org.nr", user.orgNr],
            ["Kundnummer", user.customerNo],
            ["Betalningsvillkor", `Faktura ${shopConfig.invoiceDays} dagar`],
            ["Kreditgräns", formatAmount(user.creditLimit)],
          ]}
        />
        <InfoCard
          title="Fakturering"
          onEdit={requestChange}
          rows={[
            ["Fakturamejl", user.invoiceEmail],
            [
              "Fakturaadress",
              <>
                {user.invoiceAddress.name}
                <br />
                {user.invoiceAddress.street}
                <br />
                {user.invoiceAddress.zip} {user.invoiceAddress.city}
              </>,
            ],
            ["Fakturaformat", "PDF via e-post"],
          ]}
        />
        <InfoCard
          title="Kontaktperson"
          onEdit={requestChange}
          rows={[
            ["Namn", user.contact],
            ["E-post", user.email],
            ["Mobil", user.phone],
          ]}
        />
        <InfoCard
          title="Din säljare"
          onEdit={requestChange}
          rows={[
            ["Namn", user.salesRep.name],
            ["Telefon", user.salesRep.phone],
            ["E-post", user.salesRep.email],
          ]}
        />
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Leveransadresser</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {user.addresses.map((a, i) => (
            <div key={a.id} className="card p-5 md:p-6">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-ink-soft">
                  <MapPin className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-semibold">
                    {a.label}
                    {i === 0 && <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success">Standard</span>}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {a.name}
                    <br />
                    {a.street}, {a.zip} {a.city}
                  </p>
                  {a.note && <p className="mt-2 text-sm text-muted">{a.note}</p>}
                </div>
                <button type="button" onClick={requestChange} className="text-sm font-semibold text-ink-soft hover:text-ink hover:underline">
                  Ändra
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={requestChange}
            className="flex min-h-32 items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            <Plus className="size-4" /> Lägg till leveransadress
          </button>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Användare</h2>
          <button type="button" onClick={requestChange} className="btn btn-sm btn-outline">
            <UserPlus className="size-4" /> Bjud in användare
          </button>
        </div>
        <ul className="card mt-4 divide-y divide-line">
          {user.users.map((u) => (
            <li key={u.email} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4">
              <span className="grid size-10 place-items-center rounded-full bg-sand font-display text-sm font-semibold">
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-muted">{u.email}</p>
              </div>
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink-soft">{u.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
