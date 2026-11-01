"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORDER_STORAGE_KEY, type Order } from "@/app/lib/cart";
import { formatPrice } from "@/app/lib/products";
import styles from "../checkout.module.css";

function readOrder(): Order | null {
  try {
    const data: unknown = JSON.parse(window.sessionStorage.getItem(ORDER_STORAGE_KEY) ?? "null");
    if (typeof data !== "object" || data === null) return null;
    const o = data as Order;
    return typeof o.number === "string" && Array.isArray(o.lines) && o.totals ? o : null;
  } catch {
    return null;
  }
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrder(readOrder());
    setReady(true);
  }, []);

  if (!ready) return <main className={styles.page} />;

  return (
    <main className={styles.page}>
      {order ? (
        <>
          <h1 className={styles.title}>Thank you, {order.name}</h1>
          <p className={styles.note}>
            Order number: <strong data-testid="order-number">{order.number}</strong>
          </p>
          <section className={styles.summary} aria-label="Order details">
            <ul>
              {order.lines.map((line) => (
                <li key={line.id}>
                  <p className={styles.itemName}>
                    {line.product.name} × {line.quantity}
                  </p>
                  <span>{formatPrice(line.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>{formatPrice(order.totals.subtotal)}</span>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <span>{order.totals.shipping === 0 ? "Free" : formatPrice(order.totals.shipping)}</span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>Total</span>
              <span>{formatPrice(order.totals.total)}</span>
            </div>
          </section>
        </>
      ) : (
        <>
          <h1 className={styles.title}>No recent order</h1>
          <p className={styles.note}>We couldn&apos;t find an order to show.</p>
        </>
      )}
      <Link href="/" className={styles.back}>
        ← Back to the shop
      </Link>
    </main>
  );
}
