import { CartButton } from "@/app/components/Cart";
import { HeroArt } from "@/app/components/ProductArt";
import { ProductCard } from "@/app/components/ProductCard";
import { products } from "@/app/lib/products";
import Link from "next/link";
import styles from "./page.module.css";

const promises = [
  { title: "Made by small makers", body: "Every piece comes from a studio of fewer than ten people." },
  { title: "Free shipping over $75", body: "Packed in recycled paper, delivered in 2–4 days." },
  { title: "Thirty-day returns", body: "Live with it for a month. If it isn't right, send it back." },
];

export default function Home() {
  return (
    <>
      <div className={styles.announce}>Autumn sale: selected pieces up to 25% off, while they last.</div>

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Fernwood Supply home">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="15" fill="var(--accent)" />
            <path d="M16 25V11m0 4 5-4m-5 8-5-4" stroke="var(--accent-ink)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
          Fernwood Supply
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <a href="#shop">Shop</a>
          <a href="#makers">Makers</a>
          <a href="#journal">Journal</a>
        </nav>
        <CartButton />
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>The autumn edit</p>
            <h1 className={styles.title}>
              Goods for <em>slow</em> evenings.
            </h1>
            <p className={styles.lede}>
              Linen, oak, brass and stoneware from independent makers. Built to be used every day and kept for
              decades.
            </p>
            <div className={styles.ctas}>
              <a className={styles.primary} href="#shop">
                Shop the collection
              </a>
              <a className={styles.secondary} href="#makers">
                Meet the makers
              </a>
            </div>
            <p className={styles.proof}>
              <span aria-hidden="true">★★★★★</span> 4.9 from 2,300+ homes
            </p>
          </div>
          <div className={styles.heroArt}>
            <HeroArt />
          </div>
        </section>

        <section className={styles.promises} aria-label="Our promises">
          {promises.map((p) => (
            <div key={p.title} className={styles.promise}>
              <h2>{p.title}</h2>
              <p>{p.body}</p>
            </div>
          ))}
        </section>

        <section id="shop" className={styles.shop}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>The autumn edit</h2>
            <p className={styles.sectionNote}>Six pieces, chosen for the darker months.</p>
          </div>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section id="makers" className={styles.story}>
          <div className={styles.storyInner}>
            <p className={styles.eyebrow}>Our makers</p>
            <blockquote className={styles.quote}>
              “We throw every mug by hand, so no two speckles land in the same place. That is the point.”
            </blockquote>
            <p className={styles.cite}>Mara Ellison, Hollow Clay Studio</p>
          </div>
        </section>

        <section id="journal" className={styles.signup}>
          <h2 className={styles.sectionTitle}>Letters from the workshop</h2>
          <p className={styles.sectionNote}>One short email a month: new makers, small batches, no noise.</p>
          <div className={styles.signupRow}>
            <input className={styles.input} type="email" placeholder="you@example.com" aria-label="Email address" />
            <button type="button" className={styles.primary}>
              Subscribe
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© Fernwood Supply</span>
        <span>A demo storefront. Nothing here is for sale.</span>
      </footer>
    </>
  );
}
