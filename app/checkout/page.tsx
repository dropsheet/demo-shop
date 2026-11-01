"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../components/Cart";
import { formatPrice } from "../lib/products";
import {
  validateCheckout,
  type CheckoutErrors,
  type CheckoutValues,
} from "../lib/checkout-validation";
import { createOrderNumber, saveLastOrder, type Order } from "../lib/orders";
import styles from "./checkout.module.css";

const EMPTY_VALUES: CheckoutValues = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  cardNumber: "",
};

const FIELDS: {
  name: keyof CheckoutValues;
  label: string;
  type?: string;
  inputMode?: "numeric";
  autoComplete?: string;
}[] = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "address", label: "Shipping address", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postalCode", label: "Postal code", autoComplete: "postal-code" },
  { name: "cardNumber", label: "Card number", inputMode: "numeric", autoComplete: "cc-number" },
];

export default function CheckoutPage() {
  const { items, totals, clear } = useCart();
  const router = useRouter();
  const [values, setValues] = useState<CheckoutValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<CheckoutErrors>({});

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.empty}>Your cart is empty.</p>
        <Link href="/" className={styles.back}>
          Back to the shop
        </Link>
      </main>
    );
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // The card number is validated only; it is never stored or put in the order.
    const order: Order = {
      number: createOrderNumber(),
      customerName: values.fullName.trim(),
      items: items.map(({ product, quantity, lineTotal }) => ({
        productId: product.id,
        name: product.name,
        quantity,
        unitPrice: product.price,
        lineTotal,
      })),
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      placedAt: new Date().toISOString(),
    };
    saveLastOrder(order);
    clear();
    router.push("/checkout/confirmation");
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.layout}>
        <section className={styles.summary} aria-labelledby="summary-heading">
          <h2 id="summary-heading" className={styles.heading}>
            Order summary
          </h2>
          <ul className={styles.lines}>
            {items.map(({ product, quantity, lineTotal }) => (
              <li key={product.id} className={styles.line}>
                <span>
                  {product.name} <span className={styles.qty}>× {quantity}</span>
                </span>
                <span>{formatPrice(lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className={styles.totals}>
            <div className={styles.totalRow}>
              <dt>Subtotal</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>Shipping</dt>
              <dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <dt>Total</dt>
              <dd>{formatPrice(totals.total)}</dd>
            </div>
          </dl>
        </section>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {FIELDS.map(({ name, label, type, inputMode, autoComplete }) => {
            const error = errors[name];
            const errorId = `${name}-error`;
            return (
              <div key={name} className={styles.field}>
                <label htmlFor={name} className={styles.label}>
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type ?? "text"}
                  inputMode={inputMode}
                  autoComplete={autoComplete}
                  className={styles.input}
                  value={values[name]}
                  onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                />
                {error && (
                  <p id={errorId} className={styles.error}>
                    {error}
                  </p>
                )}
              </div>
            );
          })}
          <button type="submit" className={styles.submit}>
            Place order
          </button>
        </form>
      </div>
    </main>
  );
}
