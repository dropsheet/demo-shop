import { ProductCard } from "@/app/components/ProductCard";
import { products } from "@/app/lib/products";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <span className={styles.brand}>Fernwood Supply</span>
        <nav className={styles.nav} aria-label="Main">
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
          <span className={styles.cart}>Cart (0)</span>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Autumn collection</p>
          <h1 className={styles.title}>Small-batch goods for slow evenings.</h1>
          <p className={styles.lede}>
            Linen, oak and stoneware from independent makers, built to be used
            every day.
          </p>
          <a className={styles.cta} href="#shop">
            Shop the collection
          </a>
        </section>

        <section id="shop" className={styles.shop}>
          <h2 className={styles.sectionTitle}>Featured</h2>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section id="about" className={styles.about}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p>
            Fernwood Supply is a demo storefront. Nothing here is for sale.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>© Fernwood Supply</footer>
    </>
  );
}
