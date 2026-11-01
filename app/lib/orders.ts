export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  number: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  placedAt: string;
};

const STORAGE_KEY = "fernwood-last-order";
const ORDER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function createOrderNumber(): string {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let suffix = "";
  for (const byte of bytes) {
    suffix += ORDER_CHARS[byte % ORDER_CHARS.length];
  }
  return `FW-${suffix}`;
}

export function saveLastOrder(order: Order): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Storage may be unavailable or full; the confirmation page falls back.
  }
}

function isCents(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isOrderItem(value: unknown): value is OrderItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    isCents(item.quantity) &&
    isCents(item.unitPrice) &&
    isCents(item.lineTotal)
  );
}

function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const order = value as Record<string, unknown>;
  return (
    typeof order.number === "string" &&
    typeof order.customerName === "string" &&
    typeof order.placedAt === "string" &&
    isCents(order.subtotal) &&
    isCents(order.shipping) &&
    isCents(order.total) &&
    Array.isArray(order.items) &&
    order.items.every(isOrderItem)
  );
}

export function loadLastOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isOrder(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
