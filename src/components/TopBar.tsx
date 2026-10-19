"use client";

import { useEffect, useState } from "react";
import { FileText, Truck, PackageCheck } from "lucide-react";
import { shopConfig } from "@/config/shop";
import { formatAmount } from "@/lib/format";

const messages = [
  { icon: Truck, text: `Snabb leverans inom ${shopConfig.deliveryDays} arbetsdagar` },
  { icon: PackageCheck, text: `Fri frakt över ${formatAmount(shopConfig.freeShippingThreshold)}` },
  { icon: FileText, text: "Betala mot faktura" },
];

export function TopBar() {
  const [index, setIndex] = useState(0);

  // På mobil visas ett budskap i taget som byts var femte sekund.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-ink text-[12.5px] text-white/90">
      <div className="container-page flex h-9 items-center justify-center md:justify-between">
        <ul className="hidden w-full items-center justify-center gap-10 md:flex lg:gap-16">
          {messages.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="size-3.5 text-brand-200" strokeWidth={2} />
              {text}
            </li>
          ))}
        </ul>
        <div className="relative h-full w-full md:hidden" aria-live="polite">
          {messages.map(({ icon: Icon, text }, i) => (
            <p
              key={text}
              aria-hidden={i !== index}
              className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
            >
              <Icon className="size-3.5 text-brand-200" strokeWidth={2} />
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
