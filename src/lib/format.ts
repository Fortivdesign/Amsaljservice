const priceFormatter = new Intl.NumberFormat("sv-SE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const amountFormatter = new Intl.NumberFormat("sv-SE", {
  maximumFractionDigits: 0,
});

/** 1299 -> "1 299,00 kr" */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} kr`;
}

/** 3000 -> "3 000 kr" */
export function formatAmount(value: number): string {
  return `${amountFormatter.format(Math.round(value))} kr`;
}

const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
const monthsLong = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
];
const weekdays = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];

function toDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "2026-10-19" -> "19 okt 2026" */
export function formatDate(value: string | Date): string {
  const d = toDate(value);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** "2026-10-19" -> "19 oktober 2026" */
export function formatDateLong(value: string | Date): string {
  const d = toDate(value);
  return `${d.getDate()} ${monthsLong[d.getMonth()]} ${d.getFullYear()}`;
}

/** -> "onsdag 21 oktober" */
export function formatWeekday(value: string | Date): string {
  const d = toDate(value);
  return `${weekdays[d.getDay()]} ${d.getDate()} ${monthsLong[d.getMonth()]}`;
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysAgo(n: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return toIsoDate(d);
}

export function addDays(value: string | Date, n: number): string {
  const d = new Date(toDate(value));
  d.setDate(d.getDate() + n);
  return toIsoDate(d);
}

/** Lägger till arbetsdagar (måndag till fredag). */
export function addWorkdays(value: string | Date, n: number): Date {
  const d = new Date(toDate(value));
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

/** Tar bort accenter och gör gemener, för sökning. "Postobón" -> "postobon" */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}
