"use client";

import { useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { LIMITED_DEMO, LIMITED_DETAIL, LIMITED_MESSAGE, PROTOTYPE_DEMO, allowedInLimitedDemo } from "@/lib/demoMode";

/**
 * Spärrar klick i de nedbantade lägena och visar i stället ett meddelande
 * om att delen byggs i nästa steg.
 *
 * Alla lägen: länkar till sidor som inte är med, och allt märkt data-demo-lock.
 * Prototypläget: dessutom knappar (lägg i varukorg, favoriter, antal ...).
 * Undantag är popuper, menyn, flikar, sökrutan och allt inne på Mitt konto.
 */
export function LimitedDemoGuard() {
  const { showToast } = useShop();

  useEffect(() => {
    if (!LIMITED_DEMO) return;
    const stop = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      showToast({ message: LIMITED_MESSAGE, detail: LIMITED_DETAIL, tone: "info" });
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest("[data-demo-lock]")) return stop(e);
      if (target.closest("[data-demo-allow]")) return;

      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (anchor) {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin === window.location.origin && !allowedInLimitedDemo(url.pathname)) stop(e);
        return;
      }

      if (!PROTOTYPE_DEMO) return;
      const control = target.closest("button, [role='button'], input[type='submit'], summary");
      if (!control) return;
      if (window.location.pathname.startsWith("/mitt-konto")) return;
      if (control.closest("[role='dialog'], [role='tablist'], [role='search'], [data-testid='menu-button']")) return;
      stop(e);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [showToast]);

  return null;
}
