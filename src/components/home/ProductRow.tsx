import type { Product } from "@/data/catalog";
import { ProductCard } from "../ProductCard";
import { SectionHeading } from "./SectionHeading";

/**
 * Produktrad: på mobil en vågrät lista man sveper i, på dator ett rutnät
 * med fyra eller fem kort.
 */
export function ProductRow({
  title,
  kicker,
  text,
  href,
  products,
  className = "",
}: {
  title: string;
  kicker?: string;
  text?: string;
  href?: string;
  products: Product[];
  className?: string;
}) {
  return (
    <section className={`container-page mt-16 md:mt-24 ${className}`}>
      <SectionHeading title={title} kicker={kicker} text={text} href={href} />
      <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-5 md:[&>*:nth-child(n+5)]:hidden lg:[&>*:nth-child(5)]:block">
        {products.slice(0, 8).map((p) => (
          <div key={p.articleNo} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
