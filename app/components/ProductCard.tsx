import { type Product } from "@/app/lib/products";
import Link from "next/link";
import { AddToCart } from "./Cart";
import { Price, SaleBadge } from "./Price";
import { ProductArt } from "./ProductArt";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={styles.card} data-testid="product-card" data-product={product.id}>
      <div className={styles.art}>
        <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
        <div className={styles.badge}>
          <SaleBadge product={product} />
        </div>
      </div>
      <div className={styles.body}>
        <p className={styles.maker}>{product.maker}</p>
        <h3 className={styles.name}>
          <Link href={`/products/${product.id}`} className={styles.link}>
            {product.name}
          </Link>
        </h3>
        <p className={styles.blurb}>{product.blurb}</p>
        <div className={styles.footer}>
          <Price product={product} />
          <AddToCart name={product.name} />
        </div>
      </div>
    </article>
  );
}
