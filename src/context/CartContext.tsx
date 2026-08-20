"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  key: string;
  slug: string;
  name: string;
  variantLabel?: string;
  price: number;
  image: string;
  qty: number;
}

export type AddableCartItem = Omit<CartItem, "qty">;

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  addItem: (item: AddableCartItem, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  isInCart: (key: string) => boolean;
  clear: () => void;
  checkoutItems: CartItem[];
  setCheckoutItems: (items: CartItem[]) => void;
  updateCheckoutQty: (key: string, qty: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "dongkha_zalo_cart";
const CHECKOUT_STORAGE_KEY = "dongkha_checkout_items";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutItems, setCheckoutItemsState] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        setItems(parsed.map((i) => ({ ...i, qty: i.qty && i.qty > 0 ? i.qty : 1 })));
      }
    } catch {}
    try {
      const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (raw) setCheckoutItemsState(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem = useCallback((item: AddableCartItem, qty: number = 1) => {
    const safeQty = Math.max(1, Math.floor(qty));
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key);
      if (existing) {
        return prev.map((i) => (i.key === item.key ? { ...i, qty: i.qty + safeQty } : i));
      }
      return [...prev, { ...item, qty: safeQty }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    const safeQty = Math.max(1, Math.floor(qty));
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: safeQty } : i)));
  }, []);

  const isInCart = useCallback((key: string) => items.some((i) => i.key === key), [items]);

  const clear = useCallback(() => setItems([]), []);

  const setCheckoutItems = useCallback((next: CartItem[]) => {
    setCheckoutItemsState(next);
    try {
      sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const updateCheckoutQty = useCallback((key: string, qty: number) => {
    const safeQty = Math.max(1, Math.floor(qty));
    setCheckoutItemsState((prev) => {
      const next = prev.map((i) => (i.key === key ? { ...i, qty: safeQty } : i));
      try {
        sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        hydrated,
        addItem,
        removeItem,
        updateQty,
        isInCart,
        clear,
        checkoutItems,
        setCheckoutItems,
        updateCheckoutQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
