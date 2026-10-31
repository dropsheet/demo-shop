import { formatPrice, type Product } from "@/app/lib/products";
import { AddToCart } from "./Cart";
import { ProductArt } from "./ProductArt";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const { compareAtPrice } = product;
  const original = compareAtPrice !== undefined && compareAtPrice > product.price ? compareAtPrice : null;
  return (
    <article className={styles.card} data-testid="product-card" data-product={product.id}>
      <div className={styles.art}>
        <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
        {original !== null && <span className={styles.badge}>Sale</span>}
      </div>
      <div className={styles.body}>
        <p className={styles.maker}>{product.maker}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          {original !== null ? (
            <p className={styles.prices}>
              <span className={styles.price}>
                <span className={styles.srOnly}>Sale price: </span>
                {formatPrice(product.price)}
              </span>
              <s className={styles.was}>
                <span className={styles.srOnly}>Original price: </span>
                {formatPrice(original)}
              </s>
            </p>
          ) : (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          )}
          <AddToCart name={product.name} />
        </div>
      </div>
    </article>
  );
}
