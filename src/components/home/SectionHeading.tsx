import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  kicker,
  text,
  href,
  linkLabel = "Visa alla",
  tone = "dark",
  aside,
}: {
  title: ReactNode;
  kicker?: string;
  text?: string;
  href?: string;
  linkLabel?: string;
  tone?: "dark" | "light";
  aside?: ReactNode;
}) {
  const light = tone === "light";
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="max-w-2xl">
        {kicker && <p className={`mb-2 text-xs font-bold tracking-[0.14em] uppercase ${light ? "text-sun" : "text-brand"}`}>{kicker}</p>}
        <h2 className={`font-poster text-[34px] leading-[1.25] tracking-wide uppercase md:text-5xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
        {text && <p className={`mt-2 text-[15px] md:text-base ${light ? "text-white/80" : "text-ink-soft"}`}>{text}</p>}
      </div>
      {aside}
      {href && (
        <Link
          href={href}
          className={`group inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-bold transition-colors ${
            light ? "border-white/30 text-white hover:border-white" : "border-ink/15 text-ink hover:border-ink"
          }`}
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
