"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProductArt } from "@/app/components/ProductArt";
import { formatPrice, products, type Product } from "@/app/lib/products";
import { useWishlist } from "@/app/lib/wishlist";
import styles from "./WishlistView.module.css";

function Price({ product }: { product: Product }) {
  return (
    <span className={styles.prices}>
      <span className={styles.price}>{formatPrice(product.price)}</span>
      {product.compareAtPrice ? <s className={styles.was}>{formatPrice(product.compareAtPrice)}</s> : null}
    </span>
  );
}

function Item({ product, onRemove }: { product: Product; onRemove?: () => void }) {
  return (
    <li className={styles.item} data-testid="wishlist-item" data-product={product.id}>
      <div className={styles.art}>
        <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
      </div>
      <div className={styles.body}>
        <p className={styles.maker}>{product.maker}</p>
        <h2 className={styles.name}>{product.name}</h2>
        <Price product={product} />
        {onRemove ? (
          <button type="button" className={styles.ghost} onClick={onRemove} aria-label={`Remove ${product.name}`}>
            Remove
          </button>
        ) : null}
      </div>
    </li>
  );
}

function toProducts(ids: string[]): Product[] {
  return ids.flatMap((id) => products.find((p) => p.id === id) ?? []);
}

export function WishlistView() {
  const { ids, remove, addMany } = useWishlist();
  const params = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const shared = params.get("ids");

  if (shared !== null) {
    const list = toProducts(Array.from(new Set(shared.split(",").map((s) => s.trim()).filter(Boolean))));
    return (
      <main className={styles.page}>
        <Link href="/" className={styles.back}>← Back to the shop</Link>
        <h1 className={styles.title}>Shared wishlist</h1>
        {list.length === 0 ? (
          <p className={styles.empty}>This shared wishlist has no products we recognise.</p>
        ) : (
          <>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                disabled={added}
                onClick={() => {
                  addMany(list.map((p) => p.id));
                  setAdded(true);
                }}
              >
                {added ? "Added" : "Add all to my wishlist"}
              </button>
              <Link href="/wishlist" className={styles.ghost}>View my wishlist</Link>
            </div>
            <ul className={styles.list}>
              {list.map((p) => (
                <Item key={p.id} product={p} />
              ))}
            </ul>
          </>
        )}
      </main>
    );
  }

  const list = toProducts(ids);

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}?ids=${list.map((p) => p.id).join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your wishlist link", url);
    }
  }

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>← Back to the shop</Link>
      <h1 className={styles.title}>Your wishlist</h1>
      {list.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.empty}>Nothing saved yet. Tap the heart on anything you love.</p>
          <Link href="/" className={styles.primary}>Browse the shop</Link>
        </div>
      ) : (
        <>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={share}>
              {copied ? "Copied" : "Share"}
            </button>
            <span className={styles.live} role="status">{copied ? "Link copied to clipboard" : ""}</span>
          </div>
          <ul className={styles.list}>
            {list.map((p) => (
              <Item key={p.id} product={p} onRemove={() => remove(p.id)} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
