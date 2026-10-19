import Link from "next/link";
import manifest from "@/data/asset-manifest.json";
import { shopConfig } from "@/config/shop";

/**
 * Loggan hämtas från assets/logo.* (och assets/logo-ljus.* för mörk bakgrund).
 * Finns ingen fil visas en enkel textlogga.
 */
export function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  const src = variant === "light" ? manifest.logoLight ?? manifest.logo : manifest.logo;

  return (
    <Link href="/" aria-label={`${shopConfig.companyName}, till startsidan`} className={`inline-flex h-full shrink-0 items-center ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={shopConfig.companyName} className="h-full w-auto object-contain" />
      ) : (
        <span className={`flex items-center gap-2 font-display text-lg font-bold tracking-tight ${variant === "light" ? "text-white" : "text-ink"}`}>
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-sm text-white">AM</span>
          Säljservice
        </span>
      )}
    </Link>
  );
}
