import manifest from "@/data/asset-manifest.json";
import { getBrand } from "@/data/catalog";

const brandImages = manifest.brands as Record<string, string>;

/** Märkets logga om den finns i assets/brands, annars namnet i märkets färg. */
export function BrandMark({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const url = brandImages[slug];
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name} className={`max-h-10 w-auto object-contain ${className}`} />;
  }
  const color = getBrand(slug)?.color ?? "#1c1230";
  return (
    <span className={`font-poster tracking-wide uppercase ${className}`} style={{ color }}>
      {name}
    </span>
  );
}
