import { shopConfig } from "@/config/shop";
import { packLabel } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/order";
import { ProductImage } from "../ProductImage";

export function TotalsTable({
  subtotal,
  shipping,
  vat,
  total,
  shippingLabel,
}: {
  subtotal: number;
  shipping: number | null;
  vat: number;
  total: number;
  shippingLabel?: string;
}) {
  return (
    <dl className="space-y-2.5 text-[15px]" data-testid="order-totals">
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">Delsumma exkl. moms</dt>
        <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">Frakt{shippingLabel ? `, ${shippingLabel.toLowerCase()}` : ""}</dt>
        <dd className="font-medium tabular-nums">{shipping === null ? <span className="text-muted">Väljs i steg 2</span> : shipping === 0 ? <span className="text-success">0,00 kr</span> : formatPrice(shipping)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">Moms {Math.round(shopConfig.vatRate * 100)} %</dt>
        <dd className="font-medium tabular-nums">{formatPrice(vat)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3.5">
        <dt className="font-semibold">Totalt inkl. moms</dt>
        <dd className="font-display text-2xl font-semibold tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

export function SummaryLines({ lines }: { lines: CartLine[] }) {
  return (
    <ul className="divide-y divide-line">
      {lines.map(({ product, qty, total }) => (
        <li key={product.articleNo} className="flex items-center gap-3 py-3">
          <div className="relative w-14 shrink-0">
            <ProductImage product={product} rounded="rounded-lg" padding="p-1" />
            <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-white tabular-nums">{qty}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="text-xs text-muted">
              {packLabel(product)} · Art.nr {product.articleNo}
            </p>
          </div>
          <span className="text-sm font-medium tabular-nums">{formatPrice(total)}</span>
        </li>
      ))}
    </ul>
  );
}
