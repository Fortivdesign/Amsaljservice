"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { shopConfig } from "@/config/shop";
import { offerProducts } from "@/data/catalog";
import { campaignEnd } from "@/lib/time";
import { Countdown } from "../CampaignBar";
import { ProductCard } from "../ProductCard";
import { useNow } from "../useNow";

/** Rosa kampanjblock med nedräkning och kampanjvarorna. */
export function CampaignSection() {
  const now = useNow();
  const items = offerProducts().slice(0, 4);
  return (
    <section className="relative mt-16 overflow-hidden bg-brand py-14 md:mt-24 md:py-20" data-testid="campaign-section">
      {/* Dekorativa cirklar i bakgrunden */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-sun/25" aria-hidden />
      <div className="pointer-events-none absolute -right-20 -bottom-28 size-96 rounded-full bg-tangerine/30" aria-hidden />
      <div className="container-page relative">
        <div className="flex flex-col gap-8 text-white lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-sun px-3 py-1 text-xs font-bold tracking-[0.12em] text-ink uppercase">
              <Flame className="size-3.5 fill-tangerine text-tangerine" /> Veckans kampanj
            </p>
            <h2 className="mt-4 font-poster text-[52px] leading-[0.95] tracking-wide uppercase md:text-[80px]">{shopConfig.campaign.title}</h2>
            <p className="mt-3 max-w-md text-base text-white/90 md:text-lg">{shopConfig.campaign.text}. Kampanjpriserna gäller så långt lagret räcker.</p>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end lg:flex-col lg:items-end">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.12em] uppercase lg:text-right">Slutar om</p>
              <Countdown target={campaignEnd(now ?? new Date())} now={now} />
            </div>
            <Link href="/erbjudanden" className="btn btn-lg bg-sun text-ink hover:bg-white" data-testid="campaign-cta">
              Se alla kampanjer <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
        <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4 md:[&>*:nth-child(4)]:hidden lg:[&>*:nth-child(4)]:block">
          {items.map((p) => (
            <div key={p.articleNo} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-auto">
              <ProductCard product={p} className="border-white" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
