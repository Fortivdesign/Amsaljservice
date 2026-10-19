import type { Product } from "@/data/catalog";

export function StockStatus({ product, detailed = false, className = "" }: { product: Product; detailed?: boolean; className?: string }) {
  const map = {
    "i-lager": { dot: "bg-success", text: detailed ? `I lager, ${product.stockCartons} kartonger` : "I lager", color: "text-success" },
    "fa-kvar": { dot: "bg-warning", text: detailed ? `Få kvar, ${product.stockCartons} kartonger` : "Få kvar", color: "text-warning" },
    slut: { dot: "bg-muted", text: product.restockNote ? `Slut, ${product.restockNote.toLowerCase()}` : "Tillfälligt slut", color: "text-muted" },
  }[product.stock];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${map.color} ${className}`}>
      <span className={`size-1.5 rounded-full ${map.dot}`} />
      {map.text}
    </span>
  );
}
