import Link from "next/link";
import { ArrowRight } from "lucide-react";
import manifest from "@/data/asset-manifest.json";
import { brands } from "@/data/catalog";
import { SectionHeading } from "./SectionHeading";

const brandImages = manifest.brands as Record<string, string>;

export function BrandMark({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const url = brandImages[slug];
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name} className={`max-h-10 w-auto object-contain opacity-80 grayscale ${className}`} />;
  }
  return <span className={`font-display text-lg font-semibold tracking-tight text-ink-soft ${className}`}>{name}</span>;
}

export function BrandRow() {
  return (
    <section className="container-page mt-16 md:mt-24">
      <SectionHeading title="Märken vi säljer" text="Välkända varumärken från Latinamerika och USA." href="/marken" linkLabel="Alla märken" />
      <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:gap-3 lg:grid-cols-7">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/marke/${b.slug}`}
            className="flex h-[72px] items-center justify-center rounded-2xl border border-line bg-white px-3 text-center transition-colors hover:border-ink-soft md:h-20"
          >
            <BrandMark slug={b.slug} name={b.name} className="text-[15px] md:text-lg" />
          </Link>
        ))}
        <Link
          href="/marken"
          className="flex h-[72px] items-center justify-center gap-1.5 rounded-2xl bg-sand px-3 text-sm font-semibold transition-colors hover:bg-cream md:h-20"
        >
          Alla märken <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
