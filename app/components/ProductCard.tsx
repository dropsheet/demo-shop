import { formatPrice, getOriginalPrice, type Product } from "@/app/lib/products";
import { AddToCart } from "./Cart";
import { ProductArt } from "./ProductArt";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const originalPrice = getOriginalPrice(product);
  return (
    <article className={styles.card} data-testid="product-card" data-product={product.id}>
      <div className={styles.art}>
        <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
        {originalPrice !== null && <span className={styles.badge}>Sale</span>}
      </div>
      <div className={styles.body}>
        <p className={styles.maker}>{product.maker}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          <span className={styles.prices}>
            {originalPrice !== null && (
              <span className={styles.srOnly}>Sale price </span>
            )}
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {originalPrice !== null && (
              <>
                <span className={styles.srOnly}>, original price </span>
                <s className={styles.original}>{formatPrice(originalPrice)}</s>
              </>
            )}
          </span>
          <AddToCart name={product.name} />
        </div>
      </div>
    </article>
  );
}
