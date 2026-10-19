import manifest from "@/data/asset-manifest.json";
import { getBrand, type Product } from "@/data/catalog";
import { PackPlaceholder } from "./PackPlaceholder";

const productImages = manifest.products as Record<string, string>;

export function productImageUrl(p: Product): string | null {
  const keys = [p.image, p.articleNo, p.slug].filter(Boolean).map((k) => k!.toLowerCase().replace(/\.[a-z0-9]+$/, ""));
  for (const key of keys) {
    if (productImages[key]) return productImages[key];
  }
  return null;
}

/**
 * Produktbild på enhetlig ljus bakgrund, alltid kvadratisk.
 */
export function ProductImage({
  product,
  className = "",
  rounded = "rounded-xl",
  padding = "p-[7%]",
}: {
  product: Product;
  className?: string;
  rounded?: string;
  padding?: string;
}) {
  const url = productImageUrl(product);
  const brand = getBrand(product.brand);

  return (
    <div className={`relative aspect-square w-full overflow-hidden bg-canvas ${rounded} ${className}`}>
      <div className={`absolute inset-0 flex items-center justify-center ${padding}`}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={product.name} loading="lazy" className="h-full w-full object-contain mix-blend-multiply" />
        ) : (
          <PackPlaceholder shape={product.shape} label={brand?.name} color={product.packColor ?? brand?.color} accent={product.packAccent ?? brand?.accent} className="h-full w-full" />
        )}
      </div>
    </div>
  );
}
