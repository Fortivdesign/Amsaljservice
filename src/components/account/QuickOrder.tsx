"use client";

import { useMemo, useRef, useState } from "react";
import { ClipboardPaste, Lightbulb, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { currentPrice, getBrand, packLabel, products, type Product } from "@/data/catalog";
import { formatPrice, normalize } from "@/lib/format";
import { ProductImage } from "../ProductImage";
import { QuantityStepper } from "../QuantityStepper";
import { AccountHeading } from "./AccountShell";

interface Row {
  id: number;
  art: string;
  qty: number;
}

function findExact(art: string): Product | undefined {
  const a = art.trim();
  return products.find((p) => p.articleNo === a || p.ean === a);
}

function suggestions(text: string): Product[] {
  const q = normalize(text);
  if (!q) return [];
  return products
    .filter((p) => p.articleNo.startsWith(q) || normalize(p.name).includes(q) || normalize(getBrand(p.brand)?.name ?? "").includes(q))
    .slice(0, 6);
}

function ArticleInput({ row, onChange, onPick, autoFocus }: { row: Row; onChange: (v: string) => void; onPick: (p: Product) => void; autoFocus?: boolean }) {
  const [focus, setFocus] = useState(false);
  const exact = findExact(row.art);
  const list = focus && !exact ? suggestions(row.art) : [];
  return (
    <div className="relative">
      <input
        value={row.art}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => window.setTimeout(() => setFocus(false), 150)}
        placeholder="Art.nr"
        inputMode="numeric"
        autoFocus={autoFocus}
        aria-label="Artikelnummer"
        data-testid="quick-art"
        className="field h-11 font-medium tabular-nums"
      />
      {list.length > 0 && (
        <ul className="animate-fade-in absolute top-[calc(100%+4px)] left-0 z-20 w-72 rounded-2xl border border-line bg-white p-1.5 shadow-lift">
          {list.map((p) => (
            <li key={p.articleNo}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(p);
                  setFocus(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-sand"
              >
                <span className="w-12 shrink-0 text-xs font-semibold text-muted tabular-nums">{p.articleNo}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

let nextId = 1;
const emptyRows = (n: number): Row[] => Array.from({ length: n }, () => ({ id: nextId++, art: "", qty: 1 }));

export function QuickOrder() {
  const { addManyToCart, setCartOpen } = useShop();
  const [rows, setRows] = useState<Row[]>(() => emptyRows(5));
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const lastAdded = useRef<number | null>(null);

  const update = (id: number, patch: Partial<Row>) => setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const resolved = useMemo(
    () =>
      rows.map((r) => {
        const p = findExact(r.art);
        return { row: r, product: p, total: p ? currentPrice(p) * r.qty : 0 };
      }),
    [rows],
  );
  const valid = resolved.filter((r) => r.product && r.product.stock !== "slut");
  const sum = valid.reduce((s, r) => s + r.total, 0);
  const cartons = valid.reduce((s, r) => s + r.row.qty, 0);

  const addRow = () => {
    const [row] = emptyRows(1);
    lastAdded.current = row.id;
    setRows((r) => [...r, row]);
  };

  const readPaste = () => {
    const parsed = pasteText
      .split(/\n+/)
      .map((line) => line.trim().split(/[\s;,\t]+/))
      .filter((parts) => parts[0])
      .map((parts) => ({ id: nextId++, art: parts[0], qty: Math.max(1, parseInt(parts[1] ?? "1", 10) || 1) }));
    if (parsed.length === 0) return;
    setRows((r) => [...r.filter((x) => x.art.trim()), ...parsed, ...emptyRows(1)]);
    setPasteText("");
    setPasteOpen(false);
  };

  const addAll = () => {
    addManyToCart(
      valid.map((r) => ({ articleNo: r.product!.articleNo, qty: r.row.qty })),
      `${valid.length} artiklar lagda i varukorgen`,
    );
    setRows(emptyRows(5));
    setCartOpen(true);
  };

  return (
    <div>
      <AccountHeading
        title="Snabbbeställning"
        text="Skriv artikelnummer och antal kartonger. Perfekt när du har beställningslistan framför dig."
        action={
          <button type="button" onClick={() => setPasteOpen(!pasteOpen)} className="btn btn-sm btn-outline">
            <ClipboardPaste className="size-4" /> Klistra in lista
          </button>
        }
      />

      {pasteOpen && (
        <div className="animate-fade-in card mt-5 p-5">
          <label htmlFor="paste" className="field-label">
            Klistra in artikelnummer och antal, en rad per artikel
          </label>
          <textarea
            id="paste"
            rows={4}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"10101 6\n30105 4\n20101 2"}
            className="field font-mono text-sm"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setPasteOpen(false)} className="btn btn-sm btn-ghost">
              Avbryt
            </button>
            <button type="button" onClick={readPaste} className="btn btn-sm btn-dark">
              Läs in rader
            </button>
          </div>
        </div>
      )}

      <section className="card mt-6" data-testid="quick-order">
        <div className="hidden grid-cols-[132px_minmax(0,1fr)_132px_120px_40px] gap-4 border-b border-line px-5 py-3 text-xs font-semibold tracking-wide text-muted uppercase md:grid">
          <span>Artikelnummer</span>
          <span>Produkt</span>
          <span>Antal krt</span>
          <span className="text-right">Summa</span>
          <span />
        </div>
        <ul className="divide-y divide-line">
          {resolved.map(({ row, product, total }, index) => {
            const unknown = row.art.trim().length >= 5 && !product;
            return (
              <li
                key={row.id}
                className="grid grid-cols-[110px_minmax(0,1fr)_40px] items-center gap-x-3 gap-y-3 px-4 py-3.5 md:grid-cols-[132px_minmax(0,1fr)_132px_120px_40px] md:gap-4 md:px-5"
                data-testid="quick-row"
              >
                <ArticleInput
                  row={row}
                  autoFocus={lastAdded.current === row.id}
                  onChange={(v) => update(row.id, { art: v })}
                  onPick={(p) => update(row.id, { art: p.articleNo })}
                />
                <div className="flex min-w-0 items-center gap-3">
                  {product ? (
                    <>
                      <div className="hidden w-11 shrink-0 sm:block">
                        <ProductImage product={product} rounded="rounded-lg" padding="p-0.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm leading-snug font-semibold sm:truncate">{product.name}</p>
                        <p className="truncate text-xs text-muted">
                          {packLabel(product)} · {formatPrice(currentPrice(product))}/krt
                          {product.stock === "slut" && <span className="text-danger"> · Tillfälligt slut</span>}
                        </p>
                      </div>
                    </>
                  ) : unknown ? (
                    <p className="text-sm font-medium text-danger">Hittar inget med det numret</p>
                  ) : (
                    <p className="text-sm text-muted">
                      {row.art.trim() ? "Välj produkt i listan" : index === 0 ? "Skriv ett artikelnummer, till exempel 30105" : "Tom rad"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== row.id) : emptyRows(1)))}
                  aria-label="Ta bort rad"
                  className="col-start-3 row-start-1 grid size-9 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink md:col-start-5"
                >
                  <Trash2 className="size-4" />
                </button>
                <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-1 md:col-start-3 md:row-start-1">
                  <QuantityStepper value={row.qty} onChange={(v) => update(row.id, { qty: v })} size="sm" className="w-[8.25rem]" />
                  <span className="text-sm font-semibold tabular-nums md:hidden">{product ? formatPrice(total) : ""}</span>
                </div>
                <span className="hidden text-right text-sm font-semibold tabular-nums md:col-start-4 md:row-start-1 md:block">{product ? formatPrice(total) : "0,00 kr"}</span>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-line px-4 py-3 md:px-5">
          <button type="button" onClick={addRow} className="btn btn-sm btn-ghost -ml-2">
            <Plus className="size-4" /> Lägg till rad
          </button>
        </div>
        <div className="flex flex-col gap-4 rounded-b-2xl border-t border-line bg-sand/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">{valid.length}</span> artiklar · <span className="font-semibold text-ink">{cartons}</span> kartonger ·{" "}
            <span className="font-display text-lg font-semibold text-ink tabular-nums">{formatPrice(sum)}</span> exkl. moms
          </p>
          <button type="button" onClick={addAll} disabled={valid.length === 0} className="btn btn-lg btn-primary" data-testid="quick-add">
            <ShoppingBag className="size-5" strokeWidth={1.9} /> Lägg i varukorg
          </button>
        </div>
      </section>

      <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand" />
        Artikelnumret står på produktsidan, på hyllkanten och på fakturan. Du kan också skriva en del av namnet och välja i listan.
      </p>
    </div>
  );
}
