"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LinePrice, ShippingNote, useCart } from "@/app/components/Cart";
import { ORDER_STORAGE_KEY, type Order } from "@/app/lib/cart";
import { formatPrice } from "@/app/lib/products";
import styles from "./checkout.module.css";

const fields = [
  { name: "name", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", autoComplete: "email", type: "email" },
  { name: "address", label: "Shipping address", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postal", label: "Postal code", autoComplete: "postal-code", inputMode: "numeric" },
  { name: "card", label: "Card number", autoComplete: "cc-number", inputMode: "numeric" },
] as const;

type FieldName = (typeof fields)[number]["name"];
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const blank: Values = { name: "", email: "", address: "", city: "", postal: "", card: "" };

function validate(v: Values): Errors {
  const errors: Errors = {};
  for (const f of fields) {
    if (!v[f.name].trim()) errors[f.name] = `${f.label} is required.`;
  }
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (!errors.postal && !/^\d{5}$/.test(v.postal.trim())) errors.postal = "Postal code must be 5 digits.";
  if (!errors.card && !/^\d{16}$/.test(v.card.replace(/[\s-]/g, ""))) errors.card = "Card number must be 16 digits.";
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totals, clear } = useCart();
  const [values, setValues] = useState<Values>(blank);
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0 || lines.length === 0) return;
    const order: Order = {
      number: `FW-${Date.now().toString(36).toUpperCase()}`,
      name: values.name.trim(),
      lines,
      totals,
    };
    try {
      window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch {}
    clear();
    router.push("/checkout/confirmation");
  };

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Continue shopping
      </Link>
      <h1 className={styles.title}>Checkout</h1>
      {lines.length === 0 ? (
        <p className={styles.note}>Your cart is empty.</p>
      ) : (
        <div className={styles.layout}>
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {fields.map((f) => (
              <div key={f.name} className={styles.field}>
                <label htmlFor={f.name}>{f.label}</label>
                <input
                  id={f.name}
                  name={f.name}
                  type={"type" in f ? f.type : "text"}
                  inputMode={"inputMode" in f ? f.inputMode : undefined}
                  autoComplete={f.autoComplete}
                  value={values[f.name]}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  aria-invalid={errors[f.name] ? true : undefined}
                  aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
                />
                {errors[f.name] && (
                  <p id={`${f.name}-error`} className={styles.error}>
                    {errors[f.name]}
                  </p>
                )}
              </div>
            ))}
            <button type="submit" className={styles.submit}>
              Place order
            </button>
          </form>
          <aside className={styles.summary} aria-label="Order summary">
            <h2>Order summary</h2>
            <ul>
              {lines.map((line) => (
                <li key={line.id}>
                  <div>
                    <p className={styles.itemName}>
                      {line.product.name} × {line.quantity}
                    </p>
                    <LinePrice line={line} />
                  </div>
                  <span>{formatPrice(line.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <span>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</span>
            </div>
            <ShippingNote subtotal={totals.subtotal} />
            <div className={`${styles.row} ${styles.total}`}>
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
