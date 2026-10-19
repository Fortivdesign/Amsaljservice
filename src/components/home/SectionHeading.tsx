import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  text,
  href,
  linkLabel = "Visa alla",
}: {
  title: string;
  text?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold md:text-[28px]">{title}</h2>
        {text && <p className="mt-1 text-sm text-ink-soft md:text-[15px]">{text}</p>}
      </div>
      {href && (
        <Link href={href} className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
