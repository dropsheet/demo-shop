"use client";

import Link from "next/link";
import { useWishlist } from "@/app/lib/wishlist";
import styles from "./WishlistButton.module.css";

export function WishlistButton() {
  const { count } = useWishlist();
  return (
    <Link href="/wishlist" className={styles.wishlist} aria-label={`Wishlist, ${count} saved`}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10Z"
          fill={count > 0 ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.count} aria-live="polite">
        {count}
      </span>
    </Link>
  );
}
