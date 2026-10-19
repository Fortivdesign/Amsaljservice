"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
  label = "Antal kartonger",
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}) {
  const h = size === "sm" ? "h-9" : size === "lg" ? "h-[3.25rem]" : "h-11";
  const btn = size === "sm" ? "w-8" : size === "lg" ? "w-12" : "w-10";
  const set = (v: number) => onChange(Math.max(min, Math.min(max, Number.isFinite(v) ? v : min)));

  return (
    <div className={`inline-flex items-center rounded-full border border-line-strong bg-white ${h} ${className}`}>
      <button
        type="button"
        aria-label="Minska antal"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        className={`grid h-full ${btn} shrink-0 place-items-center rounded-l-full text-ink transition-colors hover:bg-sand disabled:text-line-strong`}
      >
        <Minus className="size-4" strokeWidth={2.2} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => set(parseInt(e.target.value.replace(/\D/g, "") || String(min), 10))}
        onFocus={(e) => e.target.select()}
        className="h-full w-full min-w-0 bg-transparent text-center text-[15px] font-semibold tabular-nums outline-none"
      />
      <button
        type="button"
        aria-label="Öka antal"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        className={`grid h-full ${btn} shrink-0 place-items-center rounded-r-full text-ink transition-colors hover:bg-sand disabled:text-line-strong`}
      >
        <Plus className="size-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}
