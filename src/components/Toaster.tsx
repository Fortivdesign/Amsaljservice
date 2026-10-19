"use client";

import { CheckCircle2, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export function Toaster() {
  const { toasts, dismissToast, setCartOpen } = useShop();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 md:right-6 md:bottom-6 md:left-auto md:items-end" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          data-testid="toast"
          className="animate-slide-up pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink py-3 pr-2 pl-4 text-white shadow-lift"
        >
          <CheckCircle2 className="size-5 shrink-0 text-brand-200" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{t.message}</p>
            {t.detail && <p className="truncate text-xs text-white/70">{t.detail}</p>}
          </div>
          {t.action === "open-cart" && (
            <button
              type="button"
              onClick={() => {
                setCartOpen(true);
                dismissToast(t.id);
              }}
              className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20"
            >
              Visa varukorg
            </button>
          )}
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Stäng" className="grid size-8 shrink-0 place-items-center rounded-full text-white/60 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
