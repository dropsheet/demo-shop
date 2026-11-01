import { formatPrice } from "@/app/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/app/lib/shipping";
import styles from "./ShippingBanner.module.css";

export function ShippingBanner() {
  return (
    <div className={styles.banner} role="region" aria-label="Shipping offer">
      Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD).replace(".00", "")}.
    </div>
  );
}
