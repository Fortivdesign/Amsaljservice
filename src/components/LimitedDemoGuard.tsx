"use client";

import { useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { LIMITED_DEMO, LIMITED_DETAIL, LIMITED_MESSAGE, allowedInLimitedDemo } from "@/lib/demoMode";

/**
 * I den nedbantade versionen stoppas klick på länkar till sidor som inte
 * finns med, och på knappar märkta med data-demo-lock. I stället visas ett
 * meddelande om att delen byggs i nästa steg.
 */
export function LimitedDemoGuard() {
  const { showToast } = useShop();

  useEffect(() => {
    if (!LIMITED_DEMO) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const locked = target.closest("[data-demo-lock]");
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      let block = !!locked;
      if (!block && anchor) {
        const url = new URL(anchor.href, window.location.href);
        block = url.origin === window.location.origin && !allowedInLimitedDemo(url.pathname);
      }
      if (!block) return;
      e.preventDefault();
      e.stopPropagation();
      showToast({ message: LIMITED_MESSAGE, detail: LIMITED_DETAIL, tone: "info" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [showToast]);

  return null;
}
