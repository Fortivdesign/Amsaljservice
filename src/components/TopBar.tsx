"use client";

import { FileText, PackageCheck, Star, Truck } from "lucide-react";
import { shopConfig } from "@/config/shop";
import { formatAmount } from "@/lib/format";
import { useShop } from "@/context/ShopContext";
import { cartSubtotal, remainingForFreeShipping } from "@/lib/order";

type Message = { icon: typeof Truck; text: string; highlight?: boolean };

/** Fraktbudskapet visar hur mycket som är kvar när det finns varor i varukorgen. */
function useMessages(): Message[] {
  const { cart, hydrated } = useShop();
  const subtotal = hydrated ? cartSubtotal(cart) : 0;
  const remaining = remainingForFreeShipping(subtotal);
  const freight: Message =
    subtotal <= 0
      ? { icon: PackageCheck, text: `Fri frakt över ${formatAmount(shopConfig.freeShippingThreshold)}` }
      : remaining > 0
        ? { icon: PackageCheck, text: `${formatAmount(remaining)} kvar till fri frakt`, highlight: true }
        : { icon: PackageCheck, text: "Du har fri frakt", highlight: true };
  return [{ icon: Truck, text: `Snabb leverans inom ${shopConfig.deliveryDays} arbetsdagar` }, freight, { icon: FileText, text: "Betala mot faktura" }];
}

function Item({ icon: Icon, text, highlight }: Message) {
  return (
    <span className={`flex shrink-0 items-center gap-2 font-semibold whitespace-nowrap ${highlight ? "text-sun" : ""}`} data-testid={highlight ? "usp-freight-left" : undefined}>
      <Icon className="size-4 text-sun" strokeWidth={2.2} />
      {text}
    </span>
  );
}

/**
 * USP-raden. Ligger i den fasta headern så att den alltid syns.
 * På mobil rullar budskapen förbi i en slinga.
 */
export function TopBar() {
  const { rating, reviewCount } = shopConfig.socialProof;
  const messages = useMessages();
  return (
    <div className="bg-ink text-[12.5px] text-white" data-testid="usp-bar">
      <div className="container-page hidden h-9 items-center justify-between gap-6 md:flex">
        <div className="flex items-center gap-8 lg:gap-12">
          {messages.map((m, i) => (
            <Item key={i} {...m} />
          ))}
        </div>
        <span className="hidden items-center gap-1.5 font-semibold whitespace-nowrap lg:flex">
          <span className="flex text-sun">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-current" strokeWidth={0} />
            ))}
          </span>
          {rating.toLocaleString("sv-SE")} av 5 från {reviewCount} butiker
        </span>
      </div>
      <div className="relative flex h-8 items-center overflow-hidden md:hidden" aria-label={messages.map((m) => m.text).join(". ")}>
        <div className="animate-marquee flex w-max gap-8 pl-4" aria-hidden>
          {[...messages, ...messages].map((m, i) => (
            <Item key={i} {...m} />
          ))}
        </div>
      </div>
    </div>
  );
}
