import { CheckCircle2, Truck } from "lucide-react";
import { shopConfig } from "@/config/shop";
import { formatAmount } from "@/lib/format";
import { remainingForFreeShipping } from "@/lib/order";

export function FreeShippingMeter({ subtotal, className = "" }: { subtotal: number; className?: string }) {
  const remaining = remainingForFreeShipping(subtotal);
  const pct = Math.min(100, (subtotal / shopConfig.freeShippingThreshold) * 100);
  const reached = remaining <= 0;

  return (
    <div className={`rounded-xl bg-sand px-4 py-3 ${className}`} data-testid="free-shipping-meter">
      <p className="flex items-center gap-2 text-sm text-ink">
        {reached ? (
          <>
            <CheckCircle2 className="size-[18px] shrink-0 text-success" strokeWidth={2} />
            <span>
              <span className="font-semibold">Du har fri frakt</span> på standardleverans
            </span>
          </>
        ) : (
          <>
            <Truck className="size-[18px] shrink-0 text-brand" strokeWidth={2} />
            <span>
              Du har <span className="font-semibold tabular-nums">{formatAmount(remaining)}</span> kvar till fri frakt
            </span>
          </>
        )}
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
        <div className={`h-full rounded-full transition-[width] duration-500 ${reached ? "bg-success" : "bg-brand"}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 flex justify-between text-[11px] text-muted tabular-nums">
        <span>0 kr</span>
        <span>Fri frakt vid {formatAmount(shopConfig.freeShippingThreshold)} exkl. moms</span>
      </p>
    </div>
  );
}
