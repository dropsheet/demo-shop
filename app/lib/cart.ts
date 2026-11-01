import { products, type Product } from "./products";

/** Free-shipping threshold: USD 75, in cents like Product.price. */
export const FREE_SHIPPING_THRESHOLD = 7500;

/** Flat shipping fee in cents below the threshold. This value is an assumption, not from the work order. */
export const SHIPPING_FEE = 900;

export const CART_STORAGE_KEY = "fernwood-cart";

export type CartLine = { productId: string; quantity: number };

export type ResolvedLine = { product: Product; quantity: number; lineTotal: number };

export type Totals = {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  amountToFreeShipping: number;
};

export type CartAction =
  | { type: "add"; productId: string }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add":
      return lines.some((l) => l.productId === action.productId)
        ? lines.map((l) => (l.productId === action.productId ? { ...l, quantity: l.quantity + 1 } : l))
        : [...lines, { productId: action.productId, quantity: 1 }];
    case "setQuantity":
      if (action.quantity < 1) return lines.filter((l) => l.productId !== action.productId);
      return lines.map((l) => (l.productId === action.productId ? { ...l, quantity: action.quantity } : l));
    case "remove":
      return lines.filter((l) => l.productId !== action.productId);
    case "clear":
      return [];
    case "hydrate":
      return action.lines;
  }
}

export function parseStoredCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const lines: CartLine[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue;
    const { productId, quantity } = entry as { productId?: unknown; quantity?: unknown };
    if (typeof productId !== "string" || seen.has(productId)) continue;
    if (!products.some((p) => p.id === productId)) continue;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) continue;
    seen.add(productId);
    lines.push({ productId, quantity });
  }
  return lines;
}

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const resolved: ResolvedLine[] = [];
  for (const line of lines) {
    const product = products.find((p) => p.id === line.productId);
    if (product) resolved.push({ product, quantity: line.quantity, lineTotal: product.price * line.quantity });
  }
  return resolved;
}

export function getTotals(items: ResolvedLine[]): Totals {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return {
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping,
    amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
}
