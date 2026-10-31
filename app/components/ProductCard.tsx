import { formatPrice, type Product } from "@/app/lib/products";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const [from, to] = product.swatch;
  return (
    <article className={styles.card}>
      <div
        className={styles.art}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-hidden="true"
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <button type="button" className={styles.add}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
