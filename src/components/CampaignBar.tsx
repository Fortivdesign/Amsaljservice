"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { shopConfig } from "@/config/shop";
import { campaignEnd, splitDuration } from "@/lib/time";
import { useNow } from "./useNow";

export function Countdown({ target, now, compact = false, tone = "light" }: { target: Date; now: Date | null; compact?: boolean; tone?: "light" | "dark" }) {
  const t = now ? splitDuration(target.getTime() - now.getTime()) : null;
  const parts: [string, number | null][] = [
    ["d", t?.days ?? null],
    ["h", t?.hours ?? null],
    ["m", t?.minutes ?? null],
    ["s", t?.seconds ?? null],
  ];
  const box = tone === "light" ? "bg-white text-ink" : "bg-ink text-white";
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 font-bold tabular-nums" aria-label="Tid kvar">
        {parts.map(([unit, v]) => (
          <span key={unit} className={`rounded-md px-1.5 py-0.5 ${box}`}>
            {v === null ? "--" : String(v).padStart(2, "0")}
            <span className="ml-px text-[0.8em] font-semibold opacity-70">{unit}</span>
          </span>
        ))}
      </span>
    );
  }
  const labels: Record<string, string> = { d: "dagar", h: "tim", m: "min", s: "sek" };
  return (
    <div className="flex gap-2" aria-label="Tid kvar av kampanjen">
      {parts.map(([unit, v]) => (
        <div key={unit} className={`grid w-16 place-items-center rounded-2xl py-2 md:w-[72px] ${box}`}>
          <span className="font-poster text-3xl leading-none tabular-nums md:text-4xl">{v === null ? "--" : String(v).padStart(2, "0")}</span>
          <span className="mt-1 text-[11px] font-semibold tracking-wide uppercase opacity-70">{labels[unit]}</span>
        </div>
      ))}
    </div>
  );
}

/** Rosa kampanjrad med nedräkning under headern. */
export function CampaignBar() {
  const now = useNow();
  const end = campaignEnd(now ?? new Date());
  return (
    <Link
      href="/erbjudanden"
      className="group block bg-brand text-white transition-colors hover:bg-brand-dark"
      data-testid="campaign-bar"
    >
      <div className="container-page flex min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-[13px] md:text-sm">
        <span className="flex items-center gap-1.5 font-poster text-base tracking-wide uppercase md:text-lg">
          <Flame className="size-4 fill-sun text-sun" />
          {shopConfig.campaign.title}
        </span>
        <span className="hidden font-medium sm:inline">{shopConfig.campaign.text}</span>
        <span className="flex items-center gap-2 text-xs font-semibold">
          Slutar om <Countdown target={end} now={now} compact />
        </span>
        <ArrowRight className="hidden size-4 transition-transform group-hover:translate-x-0.5 md:block" />
      </div>
    </Link>
  );
}
