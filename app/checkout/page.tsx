"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/app/components/Cart";
import { shippingFor, unitPrice } from "@/app/lib/cart";
import { formatPrice } from "@/app/lib/products";
import styles from "./page.module.css";

type FieldName = "name" | "email" | "address" | "city" | "postal" | "card";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const FIELDS: { name: FieldName; label: string; autoComplete: string; type?: string; inputMode?: "numeric" }[] = [
  { name: "name", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", autoComplete: "email", type: "email" },
  { name: "address", label: "Shipping address", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postal", label: "Postal code", autoComplete: "postal-code", inputMode: "numeric" },
  { name: "card", label: "Card number", autoComplete: "cc-number", inputMode: "numeric" },
];

const EMPTY: Values = { name: "", email: "", address: "", city: "", postal: "", card: "" };

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = "Enter your full name.";
  if (!v.email.trim()) errors.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (!v.address.trim()) errors.address = "Enter your shipping address.";
  if (!v.city.trim()) errors.city = "Enter your city.";
  if (!v.postal.trim()) errors.postal = "Enter your postal code.";
  else if (!/^\d{5}$/.test(v.postal.trim())) errors.postal = "Postal code must be 5 digits.";
  if (!v.card.trim()) errors.card = "Enter your card number.";
  else if (!/^\d{16}$/.test(v.card.replace(/\s/g, ""))) errors.card = "Card number must be 16 digits.";
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, ready } = useCart();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  if (!ready) return <main className={styles.main} />;

  if (items.length === 0) {
    return (
      <main className={styles.main}>
        <p className={styles.empty}>
          Your cart is empty. <Link href="/">Back to shop</Link>
        </p>
      </main>
    );
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    const order = { orderNumber, name: values.name.trim(), items, subtotal, shipping, total };
    try {
      sessionStorage.setItem("order", JSON.stringify(order));
    } catch {
      // Storage unavailable; confirmation will show its fallback.
    }
    clear();
    router.push("/checkout/confirmation");
  };

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.back}>
        ← Back to shop
      </Link>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.layout}>
        <form className={`${styles.form} ${styles.panel}`} onSubmit={onSubmit} noValidate>
          {FIELDS.map((f) => {
            const id = `checkout-${f.name}`;
            const error = errors[f.name];
            return (
              <div key={f.name} className={styles.field}>
                <label htmlFor={id} className={styles.label}>
                  {f.label}
                </label>
                <input
                  id={id}
                  name={f.name}
                  type={f.type ?? "text"}
                  inputMode={f.inputMode}
                  autoComplete={f.autoComplete}
                  className={styles.input}
                  value={values[f.name]}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
                {error && (
                  <p id={`${id}-error`} className={styles.error}>
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

        <section className={styles.panel} aria-labelledby="summary-title">
          <h2 id="summary-title" className={styles.panelTitle}>
            Order summary
          </h2>
          <ul className={styles.lines}>
            {items.map((line) => {
              const unit = unitPrice(line);
              return (
                <li key={line.id} className={styles.line}>
                  <div>
                    {line.name}
                    <div className={styles.lineMeta}>
                      Qty {line.quantity} × {formatPrice(unit)}
                      {line.salePrice !== undefined && (
                        <span className={styles.was}>{formatPrice(line.price)}</span>
                      )}
                    </div>
                  </div>
                  <span>{formatPrice(unit * line.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <dl className={styles.totals}>
            <div className={styles.totalRow}>
              <dt>Subtotal</dt>
              <dd style={{ margin: 0 }}>{formatPrice(subtotal)}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>Shipping</dt>
              <dd style={{ margin: 0 }}>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className={`${styles.totalRow} ${styles.grand}`}>
              <dt>Total</dt>
              <dd style={{ margin: 0 }}>{formatPrice(total)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
