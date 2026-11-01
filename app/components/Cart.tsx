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
import { formatPrice, type Product } from "@/app/lib/products";
import { FREE_SHIPPING_THRESHOLD, unitPrice, type CartLine } from "@/app/lib/cart";
import styles from "./Cart.module.css";

const STORAGE_KEY = "fernwood-cart";

type Cart = {
  items: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product) => void;
  setQuantity: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<Cart>({
  items: [],
  count: 0,
  subtotal: 0,
  add: () => {},
  setQuantity: () => {},
  remove: () => {},
  clear: () => {},
  open: false,
  setOpen: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

function isMoney(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

function loadCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const lines: CartLine[] = [];
    for (const entry of data) {
      if (!entry || typeof entry !== "object") continue;
      const l = entry as Record<string, unknown>;
      if (typeof l.id !== "string" || !l.id || typeof l.name !== "string" || !isMoney(l.price)) continue;
      const quantity = Math.floor(Number(l.quantity));
      if (!Number.isFinite(quantity) || quantity < 1) continue;
      if (lines.some((x) => x.id === l.id)) continue;
      lines.push({
        id: l.id,
        name: l.name,
        price: l.price,
        ...(isMoney(l.salePrice) ? { salePrice: l.salePrice } : {}),
        quantity,
      });
    }
    return lines;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable or full; the cart still works in memory
    }
  }, [items, hydrated]);

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((l) => l.id === product.id)) {
        return prev.map((l) => (l.id === product.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      const onSale = product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
      const line: CartLine = {
        id: product.id,
        name: product.name,
        price: onSale ? product.compareAtPrice! : product.price,
        ...(onSale ? { salePrice: product.price } : {}),
        quantity: 1,
      };
      return [...prev, line];
    });
  }, []);

  const setQuantity = useCallback((id: string, qty: number) => {
    const quantity = Math.floor(qty);
    setItems((prev) =>
      quantity >= 1
        ? prev.map((l) => (l.id === id ? { ...l, quantity } : l))
        : prev.filter((l) => l.id !== id),
    );
  }, []);

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, l) => n + l.quantity, 0);
  const subtotal = items.reduce((n, l) => n + unitPrice(l) * l.quantity, 0);

  const value = useMemo(
    () => ({ items, count, subtotal, add, setQuantity, remove, clear, open, setOpen }),
    [items, count, subtotal, add, setQuantity, remove, clear, open],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function CartButton() {
  const { count, setOpen } = useCart();
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
    </button>
  );
}

function CartDrawer() {
  const { items, subtotal, setQuantity, remove, open, setOpen } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const remaining = FREE_SHIPPING_THRESHOLD * 100 - subtotal;

  return (
    <div className={`${styles.root} ${open ? styles.rootOpen : ""}`} aria-hidden={!open}>
      <div className={styles.backdrop} onClick={() => setOpen(false)} data-testid="cart-backdrop" />
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Shopping cart">
        <header className={styles.head}>
          <h2 className={styles.title}>Your cart</h2>
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close cart" tabIndex={open ? 0 : -1}>
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <p className={styles.empty}>Your cart is empty.</p>
        ) : (
          <ul className={styles.lines}>
            {items.map((l) => (
              <li key={l.id} className={styles.line} data-testid="cart-line">
                <div className={styles.lineInfo}>
                  <p className={styles.lineName}>{l.name}</p>
                  <p className={styles.unit}>
                    {l.salePrice !== undefined ? (
                      <>
                        <span>{formatPrice(l.salePrice)}</span> <s className={styles.was}>{formatPrice(l.price)}</s>
                      </>
                    ) : (
                      formatPrice(l.price)
                    )}
                  </p>
                  <div className={styles.qty}>
                    <button type="button" onClick={() => setQuantity(l.id, l.quantity - 1)} aria-label={`Decrease quantity of ${l.name}`} tabIndex={open ? 0 : -1}>
                      −
                    </button>
                    <span aria-label="Quantity">{l.quantity}</span>
                    <button type="button" onClick={() => setQuantity(l.id, l.quantity + 1)} aria-label={`Increase quantity of ${l.name}`} tabIndex={open ? 0 : -1}>
                      +
                    </button>
                    <button type="button" className={styles.remove} onClick={() => remove(l.id)} tabIndex={open ? 0 : -1}>
                      Remove
                    </button>
                  </div>
                </div>
                <span className={styles.lineTotal}>{formatPrice(unitPrice(l) * l.quantity)}</span>
              </li>
            ))}
          </ul>
        )}

        <footer className={styles.foot}>
          <p className={styles.shipping} data-testid="shipping-message">
            {remaining > 0
              ? `Add ${formatPrice(remaining)} more for free shipping`
              : "You've unlocked free shipping — shipping is free"}
          </p>
          <p className={styles.subtotal}>
            <span>Subtotal</span>
            <span data-testid="cart-subtotal">{formatPrice(subtotal)}</span>
          </p>
          <Link href="/checkout" className={styles.checkout} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Checkout
          </Link>
        </footer>
      </aside>
    </div>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      className={styles.add}
      onClick={() => {
        add(product);
        setAdded(true);
      }}
    >
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
