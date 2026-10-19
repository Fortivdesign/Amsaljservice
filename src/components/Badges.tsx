import { Flame, Sparkles } from "lucide-react";
import { discountPercent, type Product } from "@/data/catalog";

/** Klistermärken på produktbilden: kampanj, nyhet och bästsäljare. */
export function ProductBadges({ product, className = "", rank }: { product: Product; className?: string; rank?: number }) {
  const pct = discountPercent(product);
  if (!pct && !product.isNew && !product.topSeller && !rank) return null;
  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      {pct ? (
        <span className="-rotate-3 rounded-lg bg-brand px-2 py-1 font-poster text-[13px] leading-none tracking-wide text-white uppercase shadow-[2px_2px_0_0_rgb(28_18_48)]">
          Spara {pct} %
        </span>
      ) : null}
      {product.isNew ? (
        <span className="inline-flex items-center gap-1 rounded-lg bg-violet px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
          <Sparkles className="size-3" /> Nyhet
        </span>
      ) : null}
      {rank ? (
        <span className="grid size-11 -rotate-6 place-items-center rounded-full border-2 border-ink bg-sun font-poster text-lg text-ink">#{rank}</span>
      ) : null}
      {product.topSeller && !pct && !rank ? (
        <span className="inline-flex items-center gap-1 rounded-lg bg-sun px-2 py-1 text-[11px] font-bold tracking-wide text-ink uppercase">
          <Flame className="size-3 fill-tangerine text-tangerine" /> Bästsäljare
        </span>
      ) : null}
    </div>
  );
}
