import { formatPrice, type Product } from "@/app/lib/products";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const [from, to] = product.swatch;
  const compareAt = product.compareAtPrice;
  const onSale = compareAt !== undefined && compareAt > product.price;
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <div
          className={styles.art}
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          aria-hidden="true"
        />
        {onSale && <span className={styles.badge}>Sale</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          <span className={styles.prices}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {onSale && (
              <s className={styles.original}>
                <span className={styles.srOnly}>Original price </span>
                {formatPrice(compareAt)}
              </s>
            )}
          </span>
          <button type="button" className={styles.add}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
