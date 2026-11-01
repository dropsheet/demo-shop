import { formatPrice, isOnSale, type Product } from "@/app/lib/products";
import { AddToCart } from "./Cart";
import { ProductArt } from "./ProductArt";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const onSale = isOnSale(product);
  return (
    <article className={styles.card} data-testid="product-card" data-product={product.id}>
      <div className={styles.art}>
        <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
        {onSale && <span className={styles.badge}>Sale</span>}
      </div>
      <div className={styles.body}>
        <p className={styles.maker}>{product.maker}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          {onSale ? (
            <p className={styles.prices}>
              <span className={styles.srOnly}>Sale price: </span>
              <span className={styles.salePrice}>{formatPrice(product.price)}</span>
              <span className={styles.srOnly}>Original price: </span>
              <s className={styles.originalPrice}>{formatPrice(product.compareAtPrice)}</s>
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
