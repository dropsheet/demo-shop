"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "../../lib/products";
import { loadLastOrder, type Order } from "../../lib/orders";
import styles from "./confirmation.module.css";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null | "loading">("loading");

  useEffect(() => {
    setOrder(loadLastOrder());
  }, []);

  if (order === "loading") {
    return (
      <main className={styles.page}>
        <p className={styles.muted}>Loading your order…</p>
      </main>
    );
  }

  if (order === null) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <p className={styles.message}>We could not find a recent order.</p>
          <Link href="/" className={styles.button}>
            Continue shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Thank you, {order.customerName}</h1>
        <p className={styles.muted}>
          Order number <strong className={styles.number}>{order.number}</strong>
        </p>
        <ul className={styles.items}>
          {order.items.map((item) => (
            <li key={item.productId} className={styles.item}>
              <span>
                {item.name} <span className={styles.muted}>× {item.quantity}</span>
              </span>
              <span>{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className={styles.totals}>
          <div className={styles.row}>
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className={styles.row}>
            <dt>Shipping</dt>
            <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
          </div>
          <div className={`${styles.row} ${styles.total}`}>
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <Link href="/" className={styles.button}>
          Continue shopping
        </Link>
      </section>
    </main>
  );
}
