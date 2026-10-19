import { categories, getBrand, products, type Product } from "@/data/catalog";
import { normalize } from "./format";

/** Enkel sökning i namn, märke, kategori, artikelnummer och EAN. */
export function searchProducts(query: string): Product[] {
  const q = normalize(query);
  if (!q) return [];
  const words = q.split(/\s+/);
  return products
    .map((p) => {
      const brand = getBrand(p.brand)?.name ?? "";
      const category = categories.find((c) => c.slug === p.category)?.name ?? "";
      const hay = normalize(`${p.name} ${brand} ${category} ${p.articleNo} ${p.ean} ${p.unitSize}`);
      if (!words.every((w) => hay.includes(w))) return null;
      const starts = normalize(p.name).startsWith(q) || normalize(brand).startsWith(q);
      return { p, score: (starts ? 100 : 0) + p.popularity };
    })
    .filter((x): x is { p: Product; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}
