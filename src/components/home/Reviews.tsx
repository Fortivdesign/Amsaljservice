import { Quote, Star } from "lucide-react";
import { shopConfig } from "@/config/shop";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex text-sun ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-5 fill-current" strokeWidth={0} />
      ))}
    </span>
  );
}

/** Omdömen från butiker. Texterna är exempel i prototypen (se config). */
export function Reviews() {
  const { rating, reviewCount, storeCount, reviews } = shopConfig.socialProof;
  return (
    <section className="mt-16 bg-ink py-14 text-white md:mt-24 md:py-20" data-testid="reviews">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-sun uppercase">Butikerna om oss</p>
            <p className="mt-3 font-poster text-[96px] leading-none text-white">{rating.toLocaleString("sv-SE")}</p>
            <Stars className="mt-2" />
            <p className="mt-3 text-white/80">
              Snittbetyg från {reviewCount} omdömen. Över {storeCount} butiker i Sverige handlar hos oss.
            </p>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {reviews.map((r, i) => (
              <li
                key={r.name}
                className={`flex flex-col rounded-[28px] p-6 ${i === 0 ? "bg-brand" : i === 1 ? "bg-teal" : "bg-tangerine"}`}
              >
                <Quote className="size-7 fill-white/25 text-white/25" />
                <p className="mt-3 flex-1 text-[15px] leading-relaxed">{r.text}</p>
                <div className="mt-5 border-t border-white/25 pt-4">
                  <Stars className="[&_svg]:size-4" />
                  <p className="mt-2 font-bold">{r.name}</p>
                  <p className="text-sm text-white/80">{r.city}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
