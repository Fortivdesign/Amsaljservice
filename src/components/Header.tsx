"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, LogOut, Menu, Phone, ShoppingBag, User, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { categories } from "@/data/catalog";
import { shopConfig } from "@/config/shop";
import { cartCount } from "@/lib/order";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";

export const navItems: { href: string; label: string; accent?: boolean }[] = [
  ...categories.map((c) => ({ href: `/kategori/${c.slug}`, label: c.name })),
  { href: "/marken", label: "Märken" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/erbjudanden", label: "Erbjudanden", accent: true },
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
      className="relative inline-flex h-11 items-center gap-2 rounded-full bg-ink pr-4 pl-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-black max-md:size-11 max-md:justify-center max-md:p-0"
    >
      <ShoppingBag className="size-5" strokeWidth={1.9} />
      <span className="hidden md:inline">Varukorg</span>
      <span
        className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] leading-none font-bold tabular-nums max-md:absolute max-md:-top-1 max-md:-right-1 ${
          count > 0 ? "bg-brand text-white" : "bg-white/15 text-white/80 max-md:hidden"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function AccountButton() {
  const { user, hydrated } = useShop();
  const loggedIn = hydrated && !!user;
  return (
    <Link
      href={loggedIn ? "/mitt-konto" : "/logga-in"}
      data-testid="account-button"
      className="inline-flex h-11 items-center gap-2.5 rounded-full border whitespace-nowrap border-line-strong bg-white pr-4 pl-3 text-[15px] font-semibold text-ink transition-colors hover:border-ink max-md:size-11 max-md:justify-center max-md:p-0"
    >
      <User className="size-5" strokeWidth={1.9} />
      <span className={`hidden transition-opacity md:inline ${hydrated ? "opacity-100" : "opacity-0"}`}>{loggedIn ? "Mitt konto" : "Logga in"}</span>
    </Link>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useShop();
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Meny">
      <div className="animate-fade-in absolute inset-0 bg-ink/40" onClick={onClose} />
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
          <Link href="/sortiment" onClick={onClose} className="flex items-center justify-between rounded-xl px-3 py-3 font-semibold hover:bg-sand">
            Alla produkter
            <ChevronRight className="size-4 text-muted" />
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between rounded-xl px-3 py-3 font-medium hover:bg-sand ${item.accent ? "text-brand" : ""}`}
            >
              {item.label}
              <ChevronRight className="size-4 text-muted" />
            </Link>
          ))}
          <div className="mx-3 my-3 border-t border-line" />
          {user ? (
            <>
              <Link href="/mitt-konto" onClick={onClose} className="block rounded-xl px-3 py-3 font-medium hover:bg-sand">
                Mitt konto
              </Link>
              <Link href="/mitt-konto/snabbbestallning" onClick={onClose} className="block rounded-xl px-3 py-3 font-medium hover:bg-sand">
                Snabbbeställning
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left font-medium text-ink-soft hover:bg-sand"
              >
                <LogOut className="size-4" /> Logga ut
              </button>
            </>
          ) : (
            <div className="grid gap-2 px-3 pt-1">
              <Link href="/logga-in" onClick={onClose} className="btn btn-dark w-full">
                Logga in
              </Link>
              <Link href="/bli-kund" onClick={onClose} className="btn btn-outline w-full">
                Bli kund
              </Link>
            </div>
          )}
        </nav>
        <div className="border-t border-line bg-sand px-5 py-4 text-sm text-ink-soft">
          <p className="font-semibold text-ink">Kundservice</p>
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
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-page flex h-16 items-center gap-2 md:h-[84px] md:gap-6">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Öppna meny"
          data-testid="menu-button"
          className="-ml-2 grid size-11 place-items-center rounded-full text-ink hover:bg-sand md:hidden"
        >
          <Menu className="size-6" strokeWidth={1.8} />
        </button>
        <div className="h-11 md:h-[60px]">
          <Logo />
        </div>
        <SearchBox className="mx-auto hidden w-full max-w-2xl md:block" />
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <AccountButton />
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
              href="/sortiment"
              className={`flex h-9 items-center rounded-full px-3.5 font-semibold transition-colors hover:bg-sand ${pathname === "/sortiment" ? "bg-sand" : ""}`}
            >
              Alla produkter
            </Link>
          </li>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-9 items-center rounded-full px-3.5 whitespace-nowrap transition-colors hover:bg-sand ${
                    active ? "bg-sand font-semibold" : "font-medium"
                  } ${item.accent ? "text-brand" : "text-ink"}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
