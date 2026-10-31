import { formatPrice, type Product } from "@/app/lib/products";
import { AddToCart } from "./Cart";
import { ProductArt } from "./ProductArt";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const { compareAtPrice } = product;
  const onSale = compareAtPrice !== undefined && compareAtPrice > product.price;
  return (
    <article className={styles.card} data-testid="product-card" data-product={product.id}>
      <div className={styles.art}>
        {onSale && <span className={styles.badge}>Sale</span>}
        <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
      </div>
      <div className={styles.body}>
        <p className={styles.maker}>{product.maker}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          <span className={styles.prices}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {onSale && <s className={styles.compare}>{formatPrice(compareAtPrice)}</s>}
          </span>
          <AddToCart name={product.name} />
        </div>
      </div>
    </article>
  );
}
