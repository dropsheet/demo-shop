"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/app/components/Cart";
import { formatPrice } from "@/app/lib/products";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { items, totals, isOpen, closeCart, setQuantity, remove } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  return (
    <div className={`${styles.root} ${isOpen ? styles.open : ""}`}>
      <div className={styles.backdrop} onClick={closeCart} aria-hidden="true" />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <header className={styles.head}>
          <h2 className={styles.title}>Your cart</h2>
          <button ref={closeRef} type="button" className={styles.close} aria-label="Close cart" onClick={closeCart}>
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <p className={styles.empty}>Your cart is empty.</p>
        ) : (
          <ul className={styles.list}>
            {items.map(({ product, quantity, lineTotal }) => (
              <li key={product.id} className={styles.line}>
                <div className={styles.info}>
                  <p className={styles.name}>{product.name}</p>
                  <p className={styles.unit}>
                    {product.compareAtPrice != null && <s className={styles.was}>{formatPrice(product.compareAtPrice)}</s>}
                    <span>{formatPrice(product.price)}</span>
                  </p>
                  <div className={styles.controls}>
                    <button
                      type="button"
                      className={styles.step}
                      aria-label={`Decrease quantity of ${product.name}`}
                      onClick={() => setQuantity(product.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span className={styles.qty} aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className={styles.step}
                      aria-label={`Increase quantity of ${product.name}`}
                      onClick={() => setQuantity(product.id, quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className={styles.remove}
                      aria-label={`Remove ${product.name}`}
                      onClick={() => remove(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className={styles.lineTotal}>{formatPrice(lineTotal)}</p>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <footer className={styles.foot}>
            <p className={styles.subtotal}>
              <span>Subtotal</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </p>
            <p className={styles.shipping}>
              {totals.amountToFreeShipping > 0
                ? `Add ${formatPrice(totals.amountToFreeShipping)} more for free shipping`
                : "You qualify for free shipping."}
            </p>
            <Link href="/checkout" className={styles.checkout} onClick={closeCart}>
              Checkout
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
