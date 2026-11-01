"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  FREE_SHIPPING_THRESHOLD,
  parseCart,
  priceLines,
  totalsFor,
  type CartLine,
  type PricedLine,
  type Totals,
} from "@/app/lib/cart";
import { formatPrice, products } from "@/app/lib/products";
import styles from "./Cart.module.css";

type Cart = {
  lines: PricedLine[];
  count: number;
  totals: Totals;
  last: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const emptyTotals: Totals = { subtotal: 0, shipping: 0, total: 0 };

const CartContext = createContext<Cart>({
  lines: [],
  count: 0,
  totals: emptyTotals,
  last: null,
  open: false,
  setOpen: () => {},
  add: () => {},
  setQuantity: () => {},
  remove: () => {},
  clear: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(CART_STORAGE_KEY);
    } catch {}
    setItems(parseCart(stored));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback((id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setItems((cur) =>
      cur.some((l) => l.id === id)
        ? cur.map((l) => (l.id === id ? { ...l, quantity: l.quantity + 1 } : l))
        : [...cur, { id, quantity: 1 }],
    );
    setLast(product.name);
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((cur) =>
      quantity < 1 ? cur.filter((l) => l.id !== id) : cur.map((l) => (l.id === id ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => setItems((cur) => cur.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Cart>(() => {
    const lines = priceLines(items);
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      totals: totalsFor(lines),
      last,
      open,
      setOpen,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [items, last, open, add, setQuantity, remove, clear]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function CartButton() {
  const { count, last, setOpen } = useCart();
  return (
    <button type="button" className={styles.cart} onClick={() => setOpen(true)} aria-haspopup="dialog">
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
    </button>
  );
}

export function LinePrice({ line }: { line: PricedLine }) {
  return (
    <span className={styles.price}>
      {line.compareAtPrice !== undefined && (
        <s className={styles.was} aria-label={`Original price ${formatPrice(line.compareAtPrice)}`}>
          {formatPrice(line.compareAtPrice)}
        </s>
      )}
      <span>{formatPrice(line.unitPrice)}</span>
    </span>
  );
}

export function ShippingNote({ subtotal }: { subtotal: number }) {
  return (
    <p className={styles.shipping}>
      {subtotal >= FREE_SHIPPING_THRESHOLD
        ? "Shipping is free."
        : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.`}
    </p>
  );
}

function CartDrawer() {
  const { lines, totals, open, setOpen, setQuantity, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={`${styles.drawerRoot} ${open ? styles.isOpen : ""}`} aria-hidden={!open}>
      <div className={styles.backdrop} data-testid="cart-backdrop" onClick={() => setOpen(false)} />
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Shopping cart" inert={!open}>
        <header className={styles.drawerHead}>
          <h2>Your cart</h2>
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close cart">
            ×
          </button>
        </header>
        {lines.length === 0 ? (
          <p className={styles.empty}>Your cart is empty.</p>
        ) : (
          <>
            <ul className={styles.items}>
              {lines.map((line) => (
                <li key={line.id} className={styles.item} data-testid="cart-line" data-product={line.id}>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{line.product.name}</p>
                    <LinePrice line={line} />
                    <div className={styles.qty}>
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${line.product.name}`}
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                      >
                        −
                      </button>
                      <span aria-label={`Quantity ${line.quantity}`}>{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${line.product.name}`}
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                      >
                        +
                      </button>
                      <button type="button" className={styles.remove} onClick={() => remove(line.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className={styles.lineTotal}>{formatPrice(line.subtotal)}</span>
                </li>
              ))}
            </ul>
            <footer className={styles.drawerFoot}>
              <div className={styles.row}>
                <span>Subtotal</span>
                <strong>{formatPrice(totals.subtotal)}</strong>
              </div>
              <ShippingNote subtotal={totals.subtotal} />
              <Link href="/checkout" className={styles.checkout} onClick={() => setOpen(false)}>
                Checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

export function AddToCart({ id }: { id: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      className={styles.add}
      onClick={() => {
        add(id);
        setAdded(true);
      }}
    >
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
