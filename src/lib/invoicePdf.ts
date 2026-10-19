/**
 * Skapar en enkel faktura som PDF direkt i webbläsaren, utan bibliotek.
 * Används bara för att "Ladda ner" ska fungera i prototypen.
 */
import { shopConfig } from "@/config/shop";
import type { Customer, Invoice, Order } from "@/data/account";
import { getProduct, packLabel } from "@/data/catalog";
import { formatDate, formatPrice } from "./format";
import { orderTotals } from "./order";

type RGB = [number, number, number];
const INK: RGB = [0.17, 0.13, 0.1];
const MUTED: RGB = [0.52, 0.48, 0.44];
const LINE: RGB = [0.9, 0.88, 0.85];
const SAND: RGB = [0.97, 0.96, 0.94];

// Ungefärliga teckenbredder för Helvetica (per 1000 enheter)
const widths: Record<string, number> = {
  " ": 278, ",": 278, ".": 278, ":": 278, "-": 333, "/": 278, "%": 889,
  "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556, "7": 556, "8": 556, "9": 556,
  k: 500, r: 333, i: 222, l: 222, t: 278, f: 278, j: 222, m: 833, w: 722,
};

function textWidth(s: string, size: number, bold = false) {
  let w = 0;
  for (const ch of s) w += widths[ch] ?? (ch === ch.toUpperCase() && /[A-ZÅÄÖ]/.test(ch) ? 667 : 556);
  return (w / 1000) * size * (bold ? 1.05 : 1);
}

function latin1(s: string) {
  const map: Record<string, string> = { "”": '"', "“": '"', "’": "'", " ": " ", " ": " " };
  return Array.from(s)
    .map((ch) => (ch.charCodeAt(0) < 256 ? ch : map[ch] ?? "?"))
    .join("");
}

function esc(s: string) {
  return latin1(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function buildInvoicePdf(invoice: Invoice, order: Order, customer: Customer): Uint8Array {
  const ops: string[] = [];
  const text = (x: number, y: number, s: string, size = 9.5, bold = false, color: RGB = INK) =>
    ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color.join(" ")} rg ${x.toFixed(2)} ${y.toFixed(2)} Td (${esc(s)}) Tj ET`);
  const right = (xRight: number, y: number, s: string, size = 9.5, bold = false, color: RGB = INK) =>
    text(xRight - textWidth(latin1(s), size, bold), y, s, size, bold, color);
  const rect = (x: number, y: number, w: number, h: number, color: RGB) => ops.push(`${color.join(" ")} rg ${x} ${y} ${w} ${h} re f`);
  const hline = (x1: number, x2: number, y: number) => ops.push(`${LINE.join(" ")} RG 0.8 w ${x1} ${y} m ${x2} ${y} l S`);

  const L = 50;
  const R = 545;

  // Avsändare
  text(L, 785, shopConfig.companyName, 15, true);
  text(L, 768, shopConfig.contact.address, 9, false, MUTED);
  text(L, 756, `Org.nr ${shopConfig.contact.orgNr} · Innehar F-skattsedel`, 9, false, MUTED);
  text(L, 744, `${shopConfig.contact.phone} · ${shopConfig.contact.email}`, 9, false, MUTED);
  right(R, 780, "FAKTURA", 22, true);

  // Fakturauppgifter
  const meta: [string, string][] = [
    ["Fakturanummer", invoice.invoiceNo],
    ["Fakturadatum", formatDate(invoice.date)],
    ["Förfallodatum", formatDate(invoice.dueDate)],
    ["Ordernummer", order.orderNo],
    ["Kundnummer", customer.customerNo],
    ["Er referens", order.reference ?? customer.contact],
  ];
  rect(330, 600, 215, 120, SAND);
  meta.forEach(([k, v], i) => {
    const y = 700 - i * 17;
    text(345, y, k, 9, false, MUTED);
    right(532, y, v, 9, true);
  });

  // Mottagare
  text(L, 700, "Faktureras till", 9, false, MUTED);
  text(L, 684, customer.company, 11, true);
  text(L, 670, customer.invoiceAddress.street, 9.5);
  text(L, 657, `${customer.invoiceAddress.zip} ${customer.invoiceAddress.city}`, 9.5);
  text(L, 644, `Org.nr ${customer.orgNr}`, 9.5);
  text(L, 631, customer.invoiceEmail, 9.5);

  // Tabell
  let y = 560;
  text(L, y, "Art.nr", 8.5, true, MUTED);
  text(100, y, "Benämning", 8.5, true, MUTED);
  right(400, y, "Antal krt", 8.5, true, MUTED);
  right(470, y, "Pris/krt", 8.5, true, MUTED);
  right(R, y, "Belopp", 8.5, true, MUTED);
  hline(L, R, y - 8);
  y -= 26;
  for (const l of order.lines) {
    const p = getProduct(l.articleNo);
    text(L, y, l.articleNo, 9.5);
    text(100, y, p ? `${p.name}, ${packLabel(p)}` : l.articleNo, 9.5);
    right(400, y, String(l.qty), 9.5);
    right(470, y, formatPrice(l.price), 9.5);
    right(R, y, formatPrice(l.qty * l.price), 9.5);
    y -= 20;
  }
  hline(L, R, y + 8);

  // Summering
  const t = orderTotals(order);
  const sums: [string, string, boolean][] = [
    ["Delsumma exkl. moms", formatPrice(t.subtotal), false],
    ["Frakt", formatPrice(t.shipping), false],
    [`Moms ${Math.round(shopConfig.vatRate * 100)} %`, formatPrice(t.vat), false],
  ];
  y -= 14;
  for (const [k, v] of sums) {
    text(330, y, k, 9.5, false, MUTED);
    right(R, y, v, 9.5);
    y -= 17;
  }
  y -= 8;
  rect(320, y - 12, 225, 30, SAND);
  text(330, y, "Att betala", 11, true);
  right(R - 6, y, formatPrice(invoice.amount), 12, true);

  // Betalning
  const py = 150;
  hline(L, R, py + 30);
  text(L, py + 10, "Betalningsinformation", 10, true);
  text(L, py - 8, "Bankgiro", 9, false, MUTED);
  text(L + 80, py - 8, "5555-1234", 9, true);
  text(L, py - 24, "OCR", 9, false, MUTED);
  text(L + 80, py - 24, invoice.invoiceNo, 9, true);
  text(L, py - 40, "Förfallodatum", 9, false, MUTED);
  text(L + 80, py - 40, formatDate(invoice.dueDate), 9, true);
  text(300, py - 8, `Betalningsvillkor ${shopConfig.invoiceDays} dagar netto.`, 9, false, MUTED);
  text(300, py - 24, "Vid försenad betalning debiteras dröjsmålsränta.", 9, false, MUTED);
  text(L, 50, "Exempelfaktura skapad i prototypen. Uppgifterna är påhittade.", 8, false, MUTED);

  const content = ops.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n%âãÏÓ\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return bytes;
}

export function downloadInvoicePdf(invoice: Invoice, order: Order, customer: Customer) {
  const bytes = buildInvoicePdf(invoice, order, customer);
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Faktura-${invoice.invoiceNo}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
