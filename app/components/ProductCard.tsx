import { formatPrice, getSale, type Product } from "@/app/lib/products";
import { AddToCart } from "./Cart";
import { ProductArt } from "./ProductArt";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const sale = getSale(product);
  return (
    <article className={styles.card} data-testid="product-card" data-product={product.id}>
      <div className={styles.art}>
        {sale && <span className={styles.badge}>Sale</span>}
        <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
      </div>
      <div className={styles.body}>
        <p className={styles.maker}>{product.maker}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          {sale ? (
            <span className={styles.prices}>
              <span className={`${styles.price} ${styles.salePrice}`}>
                <span className={styles.srOnly}>Sale price: </span>
                {formatPrice(sale.current)}
              </span>
              <s className={styles.original}>
                <span className={styles.srOnly}>Original price: </span>
                {formatPrice(sale.original)}
              </s>
            </span>
          ) : (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          )}
          <AddToCart name={product.name} />
        </div>
      </div>
    </article>
  );
}
