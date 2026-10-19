import { shopConfig } from "@/config/shop";
import { addWorkdays } from "./format";

function isWorkday(d: Date) {
  const day = d.getDay();
  return day !== 0 && day !== 6;
}

/** Nästa tidpunkt då dagens order stänger (vardagar kl. 14 som standard). */
export function nextCutoff(now = new Date()): Date {
  const { hour, minute } = shopConfig.orderCutoff;
  const d = new Date(now);
  d.setHours(hour, minute, 0, 0);
  while (!isWorkday(d) || d <= now) {
    d.setDate(d.getDate() + 1);
    d.setHours(hour, minute, 0, 0);
  }
  return d;
}

/** Leveransdag om man beställer nu. */
export function deliveryDateIfOrderedNow(now = new Date()): Date {
  const cutoff = nextCutoff(now);
  // Ordern räknas som lagd den dag som stängs vid nästa brytpunkt
  const orderDay = new Date(cutoff);
  orderDay.setHours(0, 0, 0, 0);
  return addWorkdays(orderDay, shopConfig.deliveryDays);
}

/** Slutet på veckans kampanj, söndag 23.59.59. */
export function campaignEnd(now = new Date()): Date {
  const d = new Date(now);
  const diff = (shopConfig.campaign.endsWeekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 0);
  if (d <= now) d.setDate(d.getDate() + 7);
  return d;
}

export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}
