"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getProduct } from "@/data/catalog";
import { ProductCard } from "../ProductCard";
import { AccountHeading } from "./AccountShell";

export function Favorites() {
  const { favorites } = useShop();
  const items = favorites.map((a) => getProduct(a)).filter((p) => !!p);

  return (
    <div>
      <AccountHeading title="Favoriter" text="Produkter du har sparat med hjärtat. Beställ direkt härifrån." />
      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-sand px-6 py-14 text-center">
          <Heart className="mx-auto size-8 text-ink-soft" strokeWidth={1.6} />
          <p className="mt-4 font-display text-lg font-semibold">Inga favoriter än</p>
          <p className="mt-1 text-ink-soft">Tryck på hjärtat på en produkt för att spara den här.</p>
          <Link href="/sortiment" className="btn btn-dark mt-6">
            Se sortimentet
          </Link>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 2xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p!.articleNo} product={p!} />
          ))}
        </div>
      )}
    </div>
  );
}
