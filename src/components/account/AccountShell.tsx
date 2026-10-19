"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { Building2, ClipboardList, FileText, Heart, LayoutGrid, Lock, LogOut, Package, Zap } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { PROTOTYPE_DEMO } from "@/lib/demoMode";

export const accountNav = [
  { href: "/mitt-konto", label: "Översikt", icon: LayoutGrid },
  { href: "/mitt-konto/ordrar", label: "Ordrar", icon: Package },
  { href: "/mitt-konto/fakturor", label: "Fakturor", icon: FileText },
  { href: "/mitt-konto/snabbbestallning", label: "Snabbbeställning", icon: Zap },
  { href: "/mitt-konto/inkopslistor", label: "Inköpslistor", icon: ClipboardList },
  { href: "/mitt-konto/favoriter", label: "Favoriter", icon: Heart },
  { href: "/mitt-konto/foretag", label: "Företag och adresser", icon: Building2 },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated, login, logout } = useShop();

  // I prototypen kommer man rakt in på Mitt konto som demokunden
  const leaving = useRef(false);
  useEffect(() => {
    if (PROTOTYPE_DEMO && hydrated && !user && !leaving.current) login();
  }, [hydrated, user, login]);

  if (!hydrated || (PROTOTYPE_DEMO && !user)) return <div className="min-h-[60vh]" />;

  if (!user) {
    return (
      <div className="container-page pt-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-sand">
          <Lock className="size-6 text-ink-soft" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold">Logga in för att se ditt konto</h1>
        <p className="mt-2 text-ink-soft">Här hittar du ordrar, fakturor, inköpslistor och snabbbeställning.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/logga-in" className="btn btn-lg btn-dark">
            Logga in
          </Link>
          <Link href="/bli-kund" className="btn btn-lg btn-outline">
            Bli kund
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page pt-5 md:pt-8">
      <div className="lg:grid lg:grid-cols-[256px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-40">
            <div className="rounded-3xl bg-sand p-5">
              <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Inloggad som</p>
              <p className="mt-1 font-display text-lg leading-snug font-semibold">{user.company}</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                {user.contact} · Kundnr {user.customerNo}
              </p>
            </div>
            <nav className="mt-4" aria-label="Mitt konto">
              <ul className="space-y-0.5">
                {accountNav.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] transition-colors ${
                          active ? "bg-ink font-semibold text-white" : "font-medium text-ink-soft hover:bg-sand hover:text-ink"
                        }`}
                      >
                        <Icon className="size-[18px]" strokeWidth={1.9} />
                        {label}
                      </Link>
                    </li>
                  );
                })}
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      leaving.current = true;
                      logout();
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-muted hover:bg-sand hover:text-ink"
                  >
                    <LogOut className="size-[18px]" strokeWidth={1.9} />
                    Logga ut
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <nav className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 lg:hidden" aria-label="Mitt konto">
            {accountNav.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                    active ? "bg-ink font-semibold text-white" : "bg-sand font-medium text-ink-soft"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AccountHeading({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold md:text-[36px]">{title}</h1>
        {text && <p className="mt-1.5 text-ink-soft">{text}</p>}
      </div>
      {action}
    </div>
  );
}
