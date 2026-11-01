"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  cartReducer,
  getTotals,
  parseStoredCart,
  resolveLines,
  type CartLine,
  type ResolvedLine,
  type Totals,
} from "@/app/lib/cart";
import type { Product } from "@/app/lib/products";
import styles from "./Cart.module.css";

type Cart = {
  lines: CartLine[];
  items: ResolvedLine[];
  totals: Totals;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<Cart>({
  lines: [],
  items: [],
  totals: getTotals([]),
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  add: () => {},
  setQuantity: () => {},
  remove: () => {},
  clear: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: parseStoredCart(JSON.parse(raw)) });
    } catch {
      // Unreadable or corrupt storage: start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage unavailable or full: keep the in-memory cart.
    }
  }, [lines, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const add = useCallback((productId: string) => dispatch({ type: "add", productId }), []);
  const setQuantity = useCallback(
    (productId: string, quantity: number) => dispatch({ type: "setQuantity", productId, quantity }),
    [],
  );
  const remove = useCallback((productId: string) => dispatch({ type: "remove", productId }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<Cart>(() => {
    const items = resolveLines(lines);
    return {
      lines,
      items,
      totals: getTotals(items),
      isOpen,
      openCart,
      closeCart,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, isOpen, openCart, closeCart, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

export function CartButton() {
  const { totals, openCart } = useCart();
  const count = totals.itemCount;
  return (
    <button
      type="button"
      className={styles.cart}
      aria-label={`${count} items in cart`}
      onClick={openCart}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      <span>Cart</span>
      <span className={styles.count} aria-hidden="true">
        {count}
      </span>
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1500);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <button
      type="button"
      className={styles.add}
      onClick={() => {
        add(product.id);
        setAdded(true);
      }}
    >
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
