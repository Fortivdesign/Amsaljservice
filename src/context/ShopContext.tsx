"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  buildInitialLists,
  buildInitialOrders,
  demoCustomer,
  initialFavorites,
  type Customer,
  type Order,
  type ShoppingList,
} from "@/data/account";
import { currentPrice, getProduct } from "@/data/catalog";
import { daysAgo } from "@/lib/format";
import { cartSubtotal, shippingCost, type CartItem } from "@/lib/order";

const STORAGE_KEY = "am-saljservice-demo-v1";

export interface Application {
  company: string;
  contact: string;
  email: string;
}

export interface Toast {
  id: number;
  message: string;
  detail?: string;
  action?: "open-cart";
}

interface PersistedState {
  loggedIn: boolean;
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  lists: ShoppingList[];
  application: Application | null;
}

interface PlaceOrderInput {
  shippingId: string;
  addressId: string;
  payment: "faktura" | "kort";
  reference?: string;
}

interface ShopContextValue {
  hydrated: boolean;
  user: Customer | null;
  login: () => void;
  logout: () => void;

  cart: CartItem[];
  addToCart: (articleNo: string, qty: number, opts?: { silent?: boolean }) => void;
  addManyToCart: (items: CartItem[], message?: string) => void;
  setQty: (articleNo: string, qty: number) => void;
  removeFromCart: (articleNo: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  favorites: string[];
  isFavorite: (articleNo: string) => boolean;
  toggleFavorite: (articleNo: string) => void;

  orders: Order[];
  placeOrder: (input: PlaceOrderInput) => Order;

  lists: ShoppingList[];
  createList: (name: string) => string;
  addToList: (listId: string, articleNo: string, qty: number) => void;
  removeFromList: (listId: string, articleNo: string) => void;

  application: Application | null;
  submitApplication: (a: Application) => void;

  toasts: Toast[];
  showToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;

  resetDemo: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

function freshState(): PersistedState {
  return {
    loggedIn: false,
    cart: [],
    favorites: initialFavorites,
    orders: buildInitialOrders(),
    lists: buildInitialLists(),
    application: null,
  };
}

function readStorage(): PersistedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...freshState(), ...JSON.parse(raw) } as PersistedState;
  } catch {
    return null;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<PersistedState>(() => ({
    loggedIn: false,
    cart: [],
    favorites: initialFavorites,
    orders: [],
    lists: [],
    application: null,
  }));
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // Läs sparat läge efter första renderingen. ?reset i adressen nollställer demot.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("reset")) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
      params.delete("reset");
      const query = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
    }
    setState(readStorage() ?? freshState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const update = useCallback((fn: (s: PersistedState) => PersistedState) => setState(fn), []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++toastId.current;
      setToasts((list) => [...list.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );

  const addToCart = useCallback(
    (articleNo: string, qty: number, opts?: { silent?: boolean }) => {
      if (qty <= 0) return;
      update((s) => {
        const existing = s.cart.find((i) => i.articleNo === articleNo);
        const cart = existing
          ? s.cart.map((i) => (i.articleNo === articleNo ? { ...i, qty: i.qty + qty } : i))
          : [...s.cart, { articleNo, qty }];
        return { ...s, cart };
      });
      if (!opts?.silent) {
        const p = getProduct(articleNo);
        showToast({
          message: "Tillagd i varukorgen",
          detail: p ? `${qty} krt ${p.name}` : undefined,
          action: "open-cart",
        });
      }
    },
    [update, showToast],
  );

  const addManyToCart = useCallback(
    (items: CartItem[], message?: string) => {
      update((s) => {
        const cart = [...s.cart];
        for (const item of items) {
          const product = getProduct(item.articleNo);
          if (!product || product.stock === "slut" || item.qty <= 0) continue;
          const idx = cart.findIndex((c) => c.articleNo === item.articleNo);
          if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + item.qty };
          else cart.push({ articleNo: item.articleNo, qty: item.qty });
        }
        return { ...s, cart };
      });
      if (message) showToast({ message, action: "open-cart" });
    },
    [update, showToast],
  );

  const setQty = useCallback(
    (articleNo: string, qty: number) =>
      update((s) => ({
        ...s,
        cart: qty <= 0 ? s.cart.filter((i) => i.articleNo !== articleNo) : s.cart.map((i) => (i.articleNo === articleNo ? { ...i, qty } : i)),
      })),
    [update],
  );

  const removeFromCart = useCallback(
    (articleNo: string) => update((s) => ({ ...s, cart: s.cart.filter((i) => i.articleNo !== articleNo) })),
    [update],
  );

  const clearCart = useCallback(() => update((s) => ({ ...s, cart: [] })), [update]);

  const toggleFavorite = useCallback(
    (articleNo: string) => {
      const added = !state.favorites.includes(articleNo);
      update((s) => ({
        ...s,
        favorites: added ? [...s.favorites.filter((f) => f !== articleNo), articleNo] : s.favorites.filter((f) => f !== articleNo),
      }));
      showToast({ message: added ? "Sparad i favoriter" : "Borttagen från favoriter" });
    },
    [update, showToast, state.favorites],
  );

  const placeOrder = useCallback(
    (input: PlaceOrderInput): Order => {
      const highest = Math.max(104577, ...state.orders.map((o) => Number(o.orderNo)));
      const subtotal = cartSubtotal(state.cart);
      const order: Order = {
        orderNo: String(highest + 5),
        date: daysAgo(0),
        status: "mottagen",
        lines: state.cart.flatMap((i) => {
          const p = getProduct(i.articleNo);
          return p ? [{ articleNo: i.articleNo, qty: i.qty, price: currentPrice(p) }] : [];
        }),
        shippingId: input.shippingId,
        shippingCost: shippingCost(input.shippingId, subtotal),
        addressId: input.addressId,
        payment: input.payment,
        reference: input.reference?.trim() || undefined,
      };
      update((s) => ({ ...s, orders: [order, ...s.orders], cart: [] }));
      return order;
    },
    [state.orders, state.cart, update],
  );

  const createList = useCallback(
    (name: string) => {
      const id = `lista-${Date.now()}`;
      update((s) => ({ ...s, lists: [{ id, name, updated: daysAgo(0), items: [] }, ...s.lists] }));
      return id;
    },
    [update],
  );

  const addToList = useCallback(
    (listId: string, articleNo: string, qty: number) => {
      update((s) => ({
        ...s,
        lists: s.lists.map((l) => {
          if (l.id !== listId) return l;
          const exists = l.items.find((i) => i.articleNo === articleNo);
          const items = exists
            ? l.items.map((i) => (i.articleNo === articleNo ? { ...i, qty: i.qty + qty } : i))
            : [...l.items, { articleNo, qty }];
          return { ...l, items, updated: daysAgo(0) };
        }),
      }));
      const list = state.lists.find((l) => l.id === listId);
      showToast({ message: "Sparad i inköpslista", detail: list?.name });
    },
    [update, showToast, state.lists],
  );

  const removeFromList = useCallback(
    (listId: string, articleNo: string) =>
      update((s) => ({
        ...s,
        lists: s.lists.map((l) => (l.id === listId ? { ...l, items: l.items.filter((i) => i.articleNo !== articleNo) } : l)),
      })),
    [update],
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      hydrated,
      user: state.loggedIn ? demoCustomer : null,
      login: () => update((s) => ({ ...s, loggedIn: true })),
      logout: () => {
        setCartOpen(false);
        update((s) => ({ ...s, loggedIn: false, cart: [] }));
      },
      cart: state.cart,
      addToCart,
      addManyToCart,
      setQty,
      removeFromCart,
      clearCart,
      cartOpen,
      setCartOpen,
      favorites: state.favorites,
      isFavorite: (a) => state.favorites.includes(a),
      toggleFavorite,
      orders: state.orders,
      placeOrder,
      lists: state.lists,
      createList,
      addToList,
      removeFromList,
      application: state.application,
      submitApplication: (a) => update((s) => ({ ...s, application: a })),
      toasts,
      showToast,
      dismissToast,
      resetDemo: () => {
        setCartOpen(false);
        setState(freshState());
      },
    }),
    [
      hydrated,
      state,
      update,
      addToCart,
      addManyToCart,
      setQty,
      removeFromCart,
      clearCart,
      cartOpen,
      toggleFavorite,
      placeOrder,
      createList,
      addToList,
      removeFromList,
      toasts,
      showToast,
      dismissToast,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop måste användas inom ShopProvider");
  return ctx;
}
