import Link from "next/link";
import { brands } from "@/data/catalog";

/** Gul slinga med märkena som rullar förbi. */
export function BrandTicker() {
  const items = [...brands, ...brands];
  return (
    <section className="overflow-hidden border-y-2 border-ink bg-sun" aria-label="Märken vi säljer">
      <div className="animate-marquee flex w-max items-center gap-8 py-4 md:gap-12 md:py-5">
        {items.map((b, i) => (
          <Link
            key={`${b.slug}-${i}`}
            href={`/marke/${b.slug}`}
            className="flex items-center gap-8 font-poster text-2xl tracking-wide whitespace-nowrap text-ink uppercase transition-colors hover:text-brand md:gap-12 md:text-[32px]"
            tabIndex={i >= brands.length ? -1 : 0}
          >
            {b.name}
            <span className="text-brand" aria-hidden>
              ✦
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
