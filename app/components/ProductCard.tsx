"use client";

import { formatPrice, type Product } from "@/app/lib/products";
import { useWishlist } from "@/app/lib/wishlist";
import { AddToCart } from "./Cart";
import { ProductArt } from "./ProductArt";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);

  return (
    <article className={styles.card} data-testid="product-card" data-product={product.id}>
      <div className={styles.art}>
        <button
          type="button"
          className={styles.heart}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10Z"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
      </div>
      <div className={styles.body}>
        <p className={styles.maker}>{product.maker}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <AddToCart name={product.name} />
        </div>
      </div>
    </article>
  );
}
