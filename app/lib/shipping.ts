/** Orders above this subtotal ship free, in US cents. The one place the threshold is defined. */
export const FREE_SHIPPING_THRESHOLD = 7500;

/** Flat shipping charge for orders at or below the threshold, in US cents. */
export const SHIPPING_FLAT_RATE = 695;

/** Shipping charge in US cents for an order subtotal in US cents. Over the threshold is free; $75.00 exactly is charged. */
export function shippingCost(subtotal: number): number {
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}
