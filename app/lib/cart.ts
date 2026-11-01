/** Free shipping starts at this subtotal, in US dollars. */
export const FREE_SHIPPING_THRESHOLD = 75;

/** Flat shipping rate below the threshold, in US cents. */
const FLAT_SHIPPING = 695;

/** All money in the cart (prices, subtotal, shipping) is in US cents, like Product.price. */
export type CartLine = {
  id: string;
  name: string;
  /** Original price. */
  price: number;
  /** Charged price when the product is on sale. */
  salePrice?: number;
  quantity: number;
};

export function unitPrice(p: { price: number; salePrice?: number }): number {
  return p.salePrice ?? p.price;
}

/** Shipping in cents for a subtotal in cents. */
export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD * 100 ? 0 : FLAT_SHIPPING;
}
