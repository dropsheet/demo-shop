"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import styles from "./Cart.module.css";

type Cart = { count: number; add: (name: string) => void; last: string | null };

const CartContext = createContext<Cart>({ count: 0, add: () => {}, last: null });

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const add = (name: string) => {
    setCount((c) => c + 1);
    setLast(name);
  };
  return <CartContext.Provider value={{ count, add, last }}>{children}</CartContext.Provider>;
}

export function CartButton() {
  const { count, last } = useContext(CartContext);
  return (
    <span className={styles.cart}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      <span>Cart</span>
      <span className={styles.count} aria-live="polite" aria-label={`${count} items in cart`}>
        {count}
      </span>
      {last && (
        <span key={count} className={styles.toast} role="status">
          Added {last}
        </span>
      )}
    </span>
  );
}

export function AddToCart({ name }: { name: string }) {
  const { add } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      className={styles.add}
      onClick={() => {
        add(name);
        setAdded(true);
      }}
    >
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
