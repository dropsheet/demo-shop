import { Suspense } from "react";
import { WishlistView } from "./WishlistView";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <Suspense fallback={null}>
      <WishlistView />
    </Suspense>
  );
}
