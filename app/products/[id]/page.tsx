import { AddToCart } from "@/app/components/Cart";
import { Price, SaleBadge } from "@/app/components/Price";
import { ProductArt } from "@/app/components/ProductArt";
import { products } from "@/app/lib/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <main className={styles.page} data-product={product.id}>
      <Link href="/" className={styles.back}>
        Back to shop
      </Link>
      <div className={styles.layout}>
        <div className={styles.art}>
          <ProductArt id={product.id} backdrop={product.backdrop} label={product.name} />
        </div>
        <div className={styles.info}>
          <SaleBadge product={product} />
          <p className={styles.maker}>{product.maker}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.blurb}>{product.blurb}</p>
          <div className={styles.buy}>
            <Price product={product} />
            <AddToCart name={product.name} />
          </div>
        </div>
      </div>
    </main>
  );
}
