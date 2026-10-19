"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Flame, LogOut, Menu, Phone, ShoppingBag, Sparkles, User, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { PROTOTYPE_DEMO } from "@/lib/demoMode";
import { categories } from "@/data/catalog";
import { shopConfig } from "@/config/shop";
import { cartCount } from "@/lib/order";
import { categoryStyle } from "@/lib/categoryStyle";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";
import { TopBar } from "./TopBar";

export const navItems: { href: string; label: string; dot?: string; accent?: boolean }[] = [
  ...categories.map((c) => ({ href: `/kategori/${c.slug}`, label: c.name, dot: categoryStyle[c.slug].dot })),
  { href: "/marken", label: "Märken" },
];

function CartButton() {
  const { cart, setCartOpen, hydrated } = useShop();
  const count = hydrated ? cartCount(cart) : 0;
  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label={`Varukorg, ${count} kartonger`}
      data-testid="cart-button"
      data-demo-lock
      className="relative inline-flex h-11 items-center gap-2 rounded-full bg-ink pr-4 pl-3.5 text-[15px] font-bold text-white transition-colors hover:bg-black max-md:size-11 max-md:justify-center max-md:p-0"
    >
      <ShoppingBag className="size-5" strokeWidth={2} />
      <span className="hidden md:inline">Varukorg</span>
      <span
        className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] leading-none font-bold tabular-nums max-md:absolute max-md:-top-1 max-md:-right-1 ${
          count > 0 ? "bg-sun text-ink" : "bg-white/15 text-white/80 max-md:hidden"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function AccountButtons() {
  const { user, hydrated } = useShop();
  const loggedIn = hydrated && !!user;
  return (
    <>
      <Link
        href={loggedIn || PROTOTYPE_DEMO ? "/mitt-konto" : "/logga-in"}
        data-testid="account-button"
        className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink/10 bg-white pr-4 pl-3 text-[15px] font-bold whitespace-nowrap text-ink transition-colors hover:border-ink max-md:size-11 max-md:justify-center max-md:p-0"
      >
        <User className="size-5" strokeWidth={2} />
        <span className={`hidden transition-opacity md:inline ${hydrated ? "opacity-100" : "opacity-0"}`}>{loggedIn ? "Mitt konto" : "Logga in"}</span>
      </Link>
      {hydrated && !loggedIn && (
        <Link href="/bli-kund" className="hidden h-11 items-center rounded-full bg-brand px-5 text-[15px] font-bold whitespace-nowrap text-white transition-colors hover:bg-brand-dark lg:inline-flex">
          Bli kund
        </Link>
      )}
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useShop();
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Meny">
      <div className="animate-fade-in absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="animate-slide-in-left absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white">
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <div className="h-10" onClick={onClose}>
            <Logo />
          </div>
          <button type="button" onClick={onClose} aria-label="Stäng meny" className="grid size-10 place-items-center rounded-full hover:bg-sand">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <Link href="/erbjudanden" onClick={onClose} className="mx-1 mb-2 flex items-center justify-between rounded-2xl bg-brand px-4 py-3.5 font-bold text-white">
            <span className="flex items-center gap-2">
              <Flame className="size-5 fill-sun text-sun" /> Kampanjer
            </span>
            <ChevronRight className="size-4" />
          </Link>
          <Link href="/nyheter" onClick={onClose} className="mx-1 mb-2 flex items-center justify-between rounded-2xl bg-violet-light px-4 py-3.5 font-bold text-violet">
            <span className="flex items-center gap-2">
              <Sparkles className="size-5" /> Nyheter
            </span>
            <ChevronRight className="size-4" />
          </Link>
          <Link href="/sortiment" onClick={onClose} className="flex items-center justify-between rounded-xl px-3 py-3 font-bold hover:bg-sand">
            Alla produkter
            <ChevronRight className="size-4 text-muted" />
          </Link>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose} className="flex items-center justify-between rounded-xl px-3 py-3 font-semibold hover:bg-sand">
              <span className="flex items-center gap-3">
                {item.dot && <span className={`size-2.5 rounded-full ${item.dot}`} />}
                {item.label}
              </span>
              <ChevronRight className="size-4 text-muted" />
            </Link>
          ))}
          <div className="mx-3 my-3 border-t border-line" />
          {user ? (
            <>
              <Link href="/mitt-konto" onClick={onClose} className="block rounded-xl px-3 py-3 font-semibold hover:bg-sand">
                Mitt konto
              </Link>
              <Link href="/mitt-konto/snabbbestallning" onClick={onClose} className="block rounded-xl px-3 py-3 font-semibold hover:bg-sand">
                Snabbbeställning
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left font-semibold text-ink-soft hover:bg-sand"
              >
                <LogOut className="size-4" /> Logga ut
              </button>
            </>
          ) : (
            <div className="grid gap-2 px-3 pt-1">
              <Link href="/bli-kund" onClick={onClose} className="btn btn-primary w-full">
                Bli kund, det tar 2 minuter
              </Link>
              <Link href="/logga-in" onClick={onClose} className="btn btn-outline w-full">
                Logga in
              </Link>
            </div>
          )}
        </nav>
        <div className="border-t border-line bg-sand px-5 py-4 text-sm text-ink-soft">
          <p className="font-bold text-ink">Kundservice</p>
          <p className="mt-1 flex items-center gap-2">
            <Phone className="size-4" /> {shopConfig.contact.phone}
          </p>
          <p className="mt-0.5">{shopConfig.contact.hours}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_0_var(--color-line)]">
      <TopBar />
      <div className="container-page flex h-16 items-center gap-2 md:h-[76px] md:gap-6">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Öppna meny"
          data-testid="menu-button"
          className="-ml-2 grid size-11 place-items-center rounded-full text-ink hover:bg-sand md:hidden"
        >
          <Menu className="size-6" strokeWidth={2} />
        </button>
        <div className="h-11 md:h-[56px]">
          <Logo />
        </div>
        <SearchBox className="mx-auto hidden w-full max-w-2xl md:block" />
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <AccountButtons />
          <CartButton />
        </div>
      </div>
      <div className="container-page pb-3 md:hidden">
        <SearchBox />
      </div>
      <nav className="hidden border-t border-line md:block" aria-label="Kategorier">
        <ul className="container-page no-scrollbar flex h-12 items-center gap-1 overflow-x-auto text-[14.5px]">
          <li>
            <Link
              href="/erbjudanden"
              className="flex h-9 items-center gap-1.5 rounded-full bg-brand px-4 font-bold whitespace-nowrap text-white transition-colors hover:bg-brand-dark"
            >
              <Flame className="size-4 fill-sun text-sun" /> Kampanjer
            </Link>
          </li>
          <li>
            <Link
              href="/nyheter"
              className="flex h-9 items-center gap-1.5 rounded-full bg-violet-light px-4 font-bold whitespace-nowrap text-violet transition-colors hover:bg-violet hover:text-white"
            >
              <Sparkles className="size-4" /> Nyheter
            </Link>
          </li>
          <li className="mx-1 h-5 w-px bg-line-strong" aria-hidden />
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-9 items-center gap-2 rounded-full px-3.5 font-semibold whitespace-nowrap text-ink transition-colors hover:bg-sand ${active ? "bg-sand" : ""}`}
                >
                  {item.dot && <span className={`size-2.5 rounded-full ${item.dot}`} />}
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-auto hidden xl:block">
            <Link href="/sortiment" className="flex h-9 items-center rounded-full px-3.5 font-semibold whitespace-nowrap text-ink-soft hover:text-ink">
              Alla produkter
            </Link>
          </li>
        </ul>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
