import { formatPrice, isOnSale, type Product } from "@/app/lib/products";
import styles from "./Price.module.css";

export function SaleBadge({ product }: { product: Product }) {
  if (!isOnSale(product)) return null;
  return <span className={styles.badge}>Sale</span>;
}

export function Price({ product }: { product: Product }) {
  if (!isOnSale(product) || product.compareAtPrice === undefined) {
    return <span className={styles.price}>{formatPrice(product.price)}</span>;
  }
  return (
    <span className={styles.group}>
      <span className={styles.sale}>{formatPrice(product.price)}</span>
      <s className={styles.was}>
        <span className={styles.sr}>Original price </span>
        {formatPrice(product.compareAtPrice)}
      </s>
    </span>
  );
}
