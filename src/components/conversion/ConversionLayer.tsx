"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Flame, Phone, ShoppingBag, Sparkles, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { shopConfig } from "@/config/shop";
import { brands, currentPrice, discountPercent, getBrand, getProduct, offerProducts, packLabel, type Product } from "@/data/catalog";
import { formatPrice, normalize } from "@/lib/format";
import { ProductImage } from "../ProductImage";
import { LIMITED_DEMO, LIMITED_DETAIL, LIMITED_MESSAGE } from "@/lib/demoMode";

/*
 * Konverteringslagret:
 * 1. Välkomstpopup efter en stund på sajten, eller när musen lämnar fönstret.
 * 2. Sök-nudge som visar kampanjer för det man söker på, eller hjälp om inget hittas.
 * 3. Fast knapprad på mobil för besökare som inte är inloggade.
 *
 * Styrning för demo och skärmdumpar:
 *   ?popup=visa    visar popupen direkt
 *   ?popup=av      stänger av popupen och sök-nudgen i den här webbläsaren
 *   ?popup=pa      slår på dem igen
 */

const HIDDEN_PATHS = ["/bli-kund", "/logga-in", "/kassa"];
const SEEN_KEY = "am-popup-seen";
const OFF_KEY = "am-popup-off";

function storage(kind: "local" | "session") {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function popupsOff() {
  return storage("local")?.getItem(OFF_KEY) === "1";
}

/* ---------- 1. Välkomstpopup ---------- */

function WelcomePopup() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated, addToCart, setCartOpen, showToast } = useShop();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const blocked = HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  const show = useCallback(() => {
    if (popupsOff() || storage("session")?.getItem(SEEN_KEY)) return;
    storage("session")?.setItem(SEEN_KEY, "1");
    setOpen(true);
  }, []);

  // Styrning via adressen
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("popup");
    if (p === "av") storage("local")?.setItem(OFF_KEY, "1");
    if (p === "pa") storage("local")?.removeItem(OFF_KEY);
    if (p === "visa") {
      storage("session")?.removeItem(SEEN_KEY);
      storage("local")?.removeItem(OFF_KEY);
      window.setTimeout(show, 400);
    }
  }, [show]);

  // Efter en stund på sajten
  useEffect(() => {
    if (!hydrated || blocked) return;
    const id = window.setTimeout(show, shopConfig.welcomeOffer.delaySeconds * 1000);
    return () => window.clearTimeout(id);
  }, [hydrated, blocked, show]);

  // När musen lämnar fönstret uppåt (på väg att stänga fliken)
  useEffect(() => {
    if (!hydrated || blocked) return;
    let armed = false;
    const arm = window.setTimeout(() => (armed = true), 4000);
    const onOut = (e: MouseEvent) => {
      if (armed && !e.relatedTarget && e.clientY <= 0) show();
    };
    document.addEventListener("mouseout", onOut);
    return () => {
      window.clearTimeout(arm);
      document.removeEventListener("mouseout", onOut);
    };
  }, [hydrated, blocked, show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || blocked) return null;
  const close = () => setOpen(false);
  const { percent, code } = shopConfig.welcomeOffer;
  const deal = getProduct("10111")!;
  const dealPct = discountPercent(deal);

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Erbjudande" data-testid="welcome-popup">
      <div className="animate-fade-in absolute inset-0 bg-ink/60" onClick={close} />
      <div className="animate-pop-in relative grid w-full max-w-[860px] overflow-hidden rounded-t-[32px] bg-white shadow-lift sm:rounded-[32px] md:grid-cols-[0.9fr_1.1fr]">
        <button
          type="button"
          onClick={close}
          aria-label="Stäng"
          className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-soft hover:bg-white"
        >
          <X className="size-5" />
        </button>
        <div className="relative hidden bg-sun md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/bilder/kat-godis.jpg" alt="" className="h-full w-full object-cover" />
          <span className="absolute bottom-6 left-6 -rotate-6 rounded-2xl bg-brand px-4 py-2 font-poster text-3xl text-white uppercase shadow-[4px_4px_0_0_rgb(28_18_48)]">
            {user ? `Spara ${dealPct} %` : `${percent} % rabatt`}
          </span>
        </div>
        <div className="relative h-28 overflow-hidden md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/bilder/kat-godis.jpg" alt="" className="h-full w-full object-cover" />
        </div>

        {user ? (
          <div className="p-6 sm:p-9">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-xs font-bold tracking-[0.12em] text-ink uppercase">
              <Flame className="size-3.5 fill-tangerine text-tangerine" /> Veckans deal
            </p>
            <h2 className="mt-4 font-poster text-[40px] leading-[1.3] tracking-wide uppercase md:text-5xl">
              Spara <span className="text-brand">{dealPct} %</span> på {deal.name}
            </h2>
            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-sand p-3">
              <ProductImage product={deal} className="!w-20 shrink-0" rounded="rounded-xl" padding="p-1" />
              <div>
                <p className="font-bold">{deal.name}</p>
                <p className="text-sm text-muted">{packLabel(deal)}</p>
                <p className="font-poster text-2xl text-brand">
                  {formatPrice(currentPrice(deal))} <span className="font-sans text-sm text-muted line-through">{formatPrice(deal.price)}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                addToCart(deal.articleNo, 5, { silent: true });
                close();
                setCartOpen(true);
              }}
              className="btn btn-lg btn-primary mt-5 w-full"
            >
              <ShoppingBag className="size-5" /> Lägg 5 kartonger i varukorgen
            </button>
            <button type="button" onClick={close} className="mt-3 w-full py-2 text-sm font-semibold text-ink-soft hover:text-ink">
              Nej tack, jag fortsätter handla
            </button>
          </div>
        ) : (
          <form
            className="p-6 sm:p-9"
            onSubmit={(e) => {
              e.preventDefault();
              close();
              if (LIMITED_DEMO) {
                showToast({ message: LIMITED_MESSAGE, detail: LIMITED_DETAIL, tone: "info" });
                return;
              }
              router.push(`/bli-kund?rabatt=${code}${email ? `&epost=${encodeURIComponent(email)}` : ""}`);
            }}
          >
            <p className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-xs font-bold tracking-[0.12em] text-ink uppercase">
              <Sparkles className="size-3.5" /> Välkomsterbjudande
            </p>
            <h2 className="mt-4 font-poster text-[44px] leading-[1.3] tracking-wide uppercase md:text-[56px]">
              Spara <span className="text-brand">{percent} %</span>
              <br />
              på första ordern
            </h2>
            <p className="mt-3 text-ink-soft">
              Bli kund i dag så får du {percent} % rabatt på hela din första beställning. Koden skickas när kontot är godkänt.
            </p>
            <label htmlFor="popup-email" className="sr-only">
              E-post
            </label>
            <input
              id="popup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Din e-post på jobbet"
              className="field mt-5"
            />
            <button type="submit" className="btn btn-lg btn-primary mt-3 w-full" data-testid="popup-cta">
              Ge mig {percent} % rabatt <ArrowRight className="size-5" />
            </button>
            <button type="button" onClick={close} className="mt-3 w-full py-2 text-sm font-semibold text-ink-soft hover:text-ink">
              Nej tack
            </button>
            <p className="mt-2 text-center text-xs text-muted">Gäller nya företagskunder. Ingen startavgift.</p>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

/* ---------- 2. Sök-nudge ---------- */

type Nudge = { kind: "offer"; product: Product } | { kind: "help"; query: string };

function SearchNudge() {
  const { user } = useShop();
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const misses = useRef(0);

  useEffect(() => {
    const shown = new Set<string>();
    const onSearch = (e: Event) => {
      if (popupsOff()) return;
      const { query, hits } = (e as CustomEvent<{ query: string; hits: number }>).detail;
      const q = normalize(query);
      // Kampanjvara som matchar sökningen (på märke eller namn)
      const offer = offerProducts().find((p) => {
        const brand = normalize(getBrand(p.brand)?.name ?? "");
        return normalize(p.name).includes(q) || brand.includes(q) || q.includes(brand);
      });
      if (offer && !shown.has(offer.articleNo)) {
        shown.add(offer.articleNo);
        setNudge({ kind: "offer", product: offer });
        return;
      }
      if (hits === 0 && !brands.some((b) => normalize(b.name).includes(q))) {
        misses.current += 1;
        if (misses.current >= 2) setNudge({ kind: "help", query });
      }
    };
    window.addEventListener("am:search", onSearch);
    return () => window.removeEventListener("am:search", onSearch);
  }, []);

  useEffect(() => {
    if (!nudge) return;
    const id = window.setTimeout(() => setNudge(null), 14000);
    return () => window.clearTimeout(id);
  }, [nudge]);

  if (!nudge) return null;

  return createPortal(
    <div
      className={`animate-slide-in-up fixed inset-x-3 z-[75] sm:inset-x-auto sm:left-6 sm:w-[380px] ${user ? "bottom-3" : "bottom-24 md:bottom-6"}`}
      role="status"
      data-testid="search-nudge"
    >
      <div className="relative rounded-3xl border-2 border-ink bg-white p-4 shadow-pop">
        <button type="button" onClick={() => setNudge(null)} aria-label="Stäng" className="absolute top-2 right-2 grid size-8 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink">
          <X className="size-4" />
        </button>
        {nudge.kind === "offer" ? (
          <Link href={`/produkt/${nudge.product.slug}`} onClick={() => setNudge(null)} className="flex items-center gap-3 pr-6">
            <ProductImage product={nudge.product} className="!w-16 shrink-0" rounded="rounded-xl" padding="p-1" />
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
                <Flame className="size-3.5 fill-brand" /> Kampanj på det du söker
              </span>
              <span className="mt-0.5 block font-bold leading-snug">
                Spara {discountPercent(nudge.product)} % på {nudge.product.name}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft">
                {user ? `${formatPrice(currentPrice(nudge.product))} per kartong` : "Logga in för kampanjpris"} <ArrowRight className="size-3.5" />
              </span>
            </span>
          </Link>
        ) : (
          <div className="pr-6">
            <p className="font-bold">Hittar du inte ”{nudge.query}”?</p>
            <p className="mt-1 text-sm text-ink-soft">Vi tar in nya produkter varje vecka. Ring oss så kollar vi om vi kan skaffa den till dig.</p>
            <a href={`tel:${shopConfig.contact.phone.replace(/\s/g, "")}`} className="btn btn-sm btn-dark mt-3">
              <Phone className="size-4" /> {shopConfig.contact.phone}
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/* ---------- 3. Fast knapprad på mobil ---------- */

function MobileStickyCta() {
  const pathname = usePathname();
  const { user, hydrated } = useShop();
  if (!hydrated || user || HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;
  return (
    <>
      <div className="h-20 bg-ink md:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-white/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden" data-testid="mobile-sticky-cta">
        <p className="mb-1.5 text-center text-[11px] font-semibold text-ink-soft">Se priser och beställ per kartong</p>
        <div className="grid grid-cols-[1fr_1.3fr] gap-2">
          <Link href="/logga-in" className="btn btn-sm btn-outline h-11">
            Logga in
          </Link>
          <Link href="/bli-kund" className="btn btn-sm btn-primary h-11">
            Bli kund, spara {shopConfig.welcomeOffer.percent} %
          </Link>
        </div>
      </div>
    </>
  );
}

export function ConversionLayer() {
  return (
    <>
      <WelcomePopup />
      <SearchNudge />
      <MobileStickyCta />
    </>
  );
}
