import { products, type Product } from "./products";

/** Subtotal, in US cents, at or above which shipping is free (USD 75). */
export const FREE_SHIPPING_THRESHOLD = 7500;
/** Flat shipping charge below the threshold, in US cents. */
export const SHIPPING_FLAT = 695;

export const CART_STORAGE_KEY = "fernwood-cart";

export type CartLine = { id: string; quantity: number };

export type PricedLine = CartLine & {
  product: Product;
  /** Price actually charged per unit (the sale price), in US cents. */
  unitPrice: number;
  /** Original price per unit when the product is on sale. */
  compareAtPrice?: number;
  subtotal: number;
};

export type Totals = { subtotal: number; shipping: number; total: number };

export function priceLines(lines: CartLine[]): PricedLine[] {
  return lines.flatMap((line) => {
    const product = products.find((p) => p.id === line.id);
    if (!product) return [];
    return [
      {
        ...line,
        product,
        unitPrice: product.price,
        compareAtPrice: product.compareAtPrice,
        subtotal: product.price * line.quantity,
      },
    ];
  });
}

export function shippingFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}

export function totalsFor(lines: PricedLine[]): Totals {
  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const shipping = shippingFor(subtotal);
  return { subtotal, shipping, total: subtotal + shipping };
}

/** Reads a stored cart, dropping anything malformed, unknown or merged twice. Never throws. */
export function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  const merged = new Map<string, number>();
  for (const item of data) {
    if (typeof item !== "object" || item === null) continue;
    const { id, quantity } = item as Record<string, unknown>;
    if (typeof id !== "string" || !products.some((p) => p.id === id)) continue;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) continue;
    merged.set(id, Math.min(99, (merged.get(id) ?? 0) + quantity));
  }
  return [...merged].map(([id, quantity]) => ({ id, quantity }));
}

export type Order = {
  number: string;
  name: string;
  lines: PricedLine[];
  totals: Totals;
};

export const ORDER_STORAGE_KEY = "fernwood-last-order";
