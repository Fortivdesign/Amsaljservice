import { shopConfig } from "@/config/shop";
import { currentPrice, getProduct, type Product } from "@/data/catalog";
import type { Order } from "@/data/account";

export interface CartItem {
  articleNo: string;
  qty: number;
}

export interface CartLine {
  product: Product;
  qty: number;
  price: number;
  total: number;
}

export function cartLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = getProduct(item.articleNo);
    if (!product) return [];
    const price = currentPrice(product);
    return [{ product, qty: item.qty, price, total: price * item.qty }];
  });
}

export function cartSubtotal(items: CartItem[]): number {
  return cartLines(items).reduce((sum, l) => sum + l.total, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function remainingForFreeShipping(subtotal: number): number {
  return Math.max(0, shopConfig.freeShippingThreshold - subtotal);
}

export function shippingCost(optionId: string, subtotal: number): number {
  const option = shopConfig.shippingOptions.find((o) => o.id === optionId);
  if (!option) return 0;
  if (option.freeAboveThreshold && subtotal >= shopConfig.freeShippingThreshold) return 0;
  return option.price;
}

export function totals(subtotal: number, shipping: number) {
  const net = subtotal + shipping;
  const vat = net * shopConfig.vatRate;
  return { subtotal, shipping, net, vat, total: net + vat };
}

export function orderTotals(order: Order) {
  const subtotal = order.lines.reduce((s, l) => s + l.qty * l.price, 0);
  return totals(subtotal, order.shippingCost);
}

export function orderCartonCount(order: Order): number {
  return order.lines.reduce((s, l) => s + l.qty, 0);
}
