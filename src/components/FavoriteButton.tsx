"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";

export function FavoriteButton({ articleNo, className = "", withLabel = false }: { articleNo: string; className?: string; withLabel?: boolean }) {
  const { user, isFavorite, toggleFavorite } = useShop();
  const router = useRouter();
  const active = !!user && isFavorite(articleNo);

  const onClick = () => {
    if (!user) {
      router.push("/logga-in");
      return;
    }
    toggleFavorite(articleNo);
  };

  if (withLabel) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={`btn btn-outline ${className}`}>
        <Heart className={`size-[18px] ${active ? "fill-brand text-brand" : ""}`} strokeWidth={1.8} />
        {active ? "Sparad i favoriter" : "Spara som favorit"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Ta bort från favoriter" : "Spara som favorit"}
      className={`grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-[0_1px_3px_rgb(0_0_0/0.08)] transition hover:scale-105 ${className}`}
    >
      <Heart className={`size-[18px] ${active ? "fill-brand text-brand" : "text-ink-soft"}`} strokeWidth={1.8} />
    </button>
  );
}
