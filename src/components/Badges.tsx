import { discountPercent, type Product } from "@/data/catalog";

export function ProductBadges({ product, className = "" }: { product: Product; className?: string }) {
  const pct = discountPercent(product);
  if (!pct && !product.isNew) return null;
  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      {pct ? <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">Erbjudande {pct} %</span> : null}
      {product.isNew ? <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">Nyhet</span> : null}
    </div>
  );
}
