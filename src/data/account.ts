/**
 * Påhittad kunddata för demokontot. Datum räknas relativt dagens datum
 * så att prototypen ser aktuell ut när den visas.
 */
import { addDays, daysAgo } from "@/lib/format";

export type OrderStatus = "mottagen" | "packas" | "skickad";

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  zip: string;
  city: string;
  note?: string;
}

export interface Customer {
  company: string;
  orgNr: string;
  customerNo: string;
  contact: string;
  email: string;
  phone: string;
  invoiceEmail: string;
  invoiceAddress: Address;
  addresses: Address[];
  salesRep: { name: string; phone: string; email: string };
  creditLimit: number;
  users: { name: string; role: string; email: string }[];
}

export interface OrderLine {
  articleNo: string;
  qty: number;
  /** Pris per kartong exkl. moms vid ordertillfället */
  price: number;
}

export interface Order {
  orderNo: string;
  date: string;
  status: OrderStatus;
  lines: OrderLine[];
  shippingId: string;
  shippingCost: number;
  addressId: string;
  payment: "faktura" | "kort";
  reference?: string;
  trackingNo?: string;
}

export interface Invoice {
  invoiceNo: string;
  orderNo: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  updated: string;
  items: { articleNo: string; qty: number }[];
}

export const demoCustomer: Customer = {
  company: "Tienda Sol Livs AB",
  orgNr: "559123-4567",
  customerNo: "10482",
  contact: "Maria Lindqvist",
  email: "maria@tiendasol.se",
  phone: "070 123 45 67",
  invoiceEmail: "faktura@tiendasol.se",
  invoiceAddress: {
    id: "faktura",
    label: "Fakturaadress",
    name: "Tienda Sol Livs AB",
    street: "Storgatan 14",
    zip: "151 72",
    city: "Södertälje",
  },
  addresses: [
    {
      id: "butik",
      label: "Butiken",
      name: "Tienda Sol Livs",
      street: "Storgatan 14",
      zip: "151 72",
      city: "Södertälje",
      note: "Lossning vid baksidan, ring 15 minuter innan",
    },
    {
      id: "lager",
      label: "Lager Fittja",
      name: "Tienda Sol Lager",
      street: "Fittja gårdsväg 3",
      zip: "145 51",
      city: "Norsborg",
      note: "Port 2, öppet vardagar 07.00 till 15.00",
    },
  ],
  salesRep: { name: "Andrés Martínez", phone: "070 987 65 43", email: "andres@amsaljservice.se" },
  creditLimit: 60000,
  users: [
    { name: "Maria Lindqvist", role: "Administratör", email: "maria@tiendasol.se" },
    { name: "Johan Lindqvist", role: "Beställare", email: "johan@tiendasol.se" },
  ],
};

/** Tidigare ordrar för demokontot */
export function buildInitialOrders(): Order[] {
  return [
    {
      orderNo: "104577",
      date: daysAgo(1),
      status: "packas",
      lines: [
        { articleNo: "10105", qty: 4, price: 299 },
        { articleNo: "10106", qty: 3, price: 299 },
        { articleNo: "50101", qty: 2, price: 359 },
      ],
      shippingId: "standard",
      shippingCost: 0,
      addressId: "butik",
      payment: "faktura",
      reference: "Vecka 43",
    },
    {
      orderNo: "104512",
      date: daysAgo(6),
      status: "skickad",
      lines: [
        { articleNo: "30101", qty: 2, price: 399 },
        { articleNo: "30105", qty: 4, price: 189 },
        { articleNo: "40101", qty: 3, price: 359 },
        { articleNo: "20101", qty: 2, price: 312 },
      ],
      shippingId: "standard",
      shippingCost: 0,
      addressId: "butik",
      payment: "faktura",
      reference: "Vecka 42",
      trackingNo: "00370733741234567",
    },
    {
      orderNo: "104430",
      date: daysAgo(14),
      status: "skickad",
      lines: [
        { articleNo: "10101", qty: 6, price: 129 },
        { articleNo: "10103", qty: 4, price: 135 },
        { articleNo: "10108", qty: 3, price: 279 },
        { articleNo: "10110", qty: 2, price: 159 },
      ],
      shippingId: "standard",
      shippingCost: 249,
      addressId: "lager",
      payment: "faktura",
      trackingNo: "00370733741230011",
    },
    {
      orderNo: "104356",
      date: daysAgo(27),
      status: "skickad",
      lines: [
        { articleNo: "20103", qty: 3, price: 299 },
        { articleNo: "20105", qty: 2, price: 259 },
        { articleNo: "50102", qty: 4, price: 189 },
        { articleNo: "50105", qty: 2, price: 229 },
      ],
      shippingId: "standard",
      shippingCost: 249,
      addressId: "butik",
      payment: "faktura",
      reference: "Godis inför helgen",
      trackingNo: "00370733741228890",
    },
    {
      orderNo: "104281",
      date: daysAgo(41),
      status: "skickad",
      lines: [
        { articleNo: "40103", qty: 3, price: 279 },
        { articleNo: "30102", qty: 2, price: 449 },
        { articleNo: "30103", qty: 2, price: 329 },
        { articleNo: "40105", qty: 2, price: 399 },
      ],
      shippingId: "standard",
      shippingCost: 0,
      addressId: "butik",
      payment: "faktura",
      trackingNo: "00370733741221145",
    },
  ];
}

/** Fakturor skapas när en order skickas. */
export function buildInvoices(orders: Order[], vatRate: number): Invoice[] {
  const today = daysAgo(0);
  return orders
    .filter((o) => o.status === "skickad" && o.payment === "faktura")
    .map((o, i) => {
      const net = o.lines.reduce((s, l) => s + l.qty * l.price, 0) + o.shippingCost;
      const amount = Math.round(net * (1 + vatRate) * 100) / 100;
      const date = addDays(o.date, 1);
      const dueDate = addDays(date, 30);
      return {
        invoiceNo: String(720460 - i * 37),
        orderNo: o.orderNo,
        date,
        dueDate,
        amount,
        // Äldre fakturor är betalda, de senaste är obetalda men inte förfallna
        paid: daysBetween(date, today) > 30,
      };
    });
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function buildInitialLists(): ShoppingList[] {
  return [
    {
      id: "lista-dryck",
      name: "Veckobeställning dryck",
      updated: daysAgo(3),
      items: [
        { articleNo: "10101", qty: 6 },
        { articleNo: "10103", qty: 4 },
        { articleNo: "10105", qty: 4 },
        { articleNo: "10106", qty: 4 },
        { articleNo: "10108", qty: 3 },
        { articleNo: "10110", qty: 2 },
      ],
    },
    {
      id: "lista-skafferi",
      name: "Skafferiet varannan vecka",
      updated: daysAgo(9),
      items: [
        { articleNo: "40101", qty: 3 },
        { articleNo: "40102", qty: 2 },
        { articleNo: "40103", qty: 2 },
        { articleNo: "30101", qty: 2 },
        { articleNo: "30105", qty: 4 },
      ],
    },
    {
      id: "lista-kassa",
      name: "Kassagodis",
      updated: daysAgo(20),
      items: [
        { articleNo: "50101", qty: 2 },
        { articleNo: "50102", qty: 3 },
        { articleNo: "50105", qty: 2 },
        { articleNo: "20104", qty: 2 },
      ],
    },
  ];
}

export const initialFavorites = ["10101", "30105", "20101", "50101", "40101", "10106"];

export const orderStatusLabel: Record<OrderStatus, string> = {
  mottagen: "Mottagen",
  packas: "Packas",
  skickad: "Skickad",
};
