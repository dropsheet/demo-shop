"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CartLine } from "@/app/lib/cart";
import { unitPrice } from "@/app/lib/cart";
import { formatPrice } from "@/app/lib/products";
import styles from "./page.module.css";

type Order = {
  orderNumber: string;
  name: string;
  items: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function parseOrder(raw: string | null): Order | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    if (!o || typeof o !== "object") return null;
    if (typeof o.orderNumber !== "string" || typeof o.name !== "string") return null;
    if (!isNum(o.subtotal) || !isNum(o.shipping) || !isNum(o.total)) return null;
    if (!Array.isArray(o.items)) return null;
    const items = o.items.filter(
      (l: unknown): l is CartLine =>
        !!l &&
        typeof l === "object" &&
        typeof (l as CartLine).id === "string" &&
        typeof (l as CartLine).name === "string" &&
        isNum((l as CartLine).price) &&
        isNum((l as CartLine).quantity) &&
        ((l as CartLine).salePrice === undefined || isNum((l as CartLine).salePrice)),
    );
    return { orderNumber: o.orderNumber, name: o.name, items, subtotal: o.subtotal, shipping: o.shipping, total: o.total };
  } catch {
    return null;
  }
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem("order");
    } catch {
      raw = null;
    }
    setOrder(parseOrder(raw));
    setLoaded(true);
  }, []);

  if (!loaded) return <main className={styles.main} />;

  if (!order) {
    return (
      <main className={styles.main}>
        <div className={styles.panel}>
          <h1 className={styles.title}>No order found</h1>
          <p className={styles.muted}>We couldn&apos;t find a recent order to show.</p>
          <Link href="/" className={styles.home}>
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Thank you, {order.name}!</h1>
        <p className={styles.muted}>
          Order number: <span className={styles.order}>{order.orderNumber}</span>
        </p>
        <ul className={styles.lines}>
          {order.items.map((line) => (
            <li key={line.id} className={styles.line}>
              <span>
                {line.name} × {line.quantity}
              </span>
              <span>{formatPrice(unitPrice(line) * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className={styles.totals}>
          <div className={styles.totalRow}>
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className={styles.totalRow}>
            <dt>Shipping</dt>
            <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
          </div>
          <div className={`${styles.totalRow} ${styles.grand}`}>
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <Link href="/" className={styles.home}>
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
