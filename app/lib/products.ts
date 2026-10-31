export type Product = {
  id: string;
  name: string;
  blurb: string;
  /** Price in US cents. */
  price: number;
  /** Price before a discount, in US cents. Set only on discounted products. */
  compareAtPrice?: number;
  /** Two colours for the product's swatch artwork. */
  swatch: [string, string];
};

export const products: Product[] = [
  {
    id: "linen-throw",
    name: "Linen Throw",
    blurb: "Stonewashed European linen, softer every wash.",
    price: 8900,
    swatch: ["#d9c8b4", "#a8927a"],
  },
  {
    id: "ceramic-mug",
    name: "Speckled Mug",
    blurb: "Hand-thrown stoneware, holds 12 oz.",
    price: 2400,
    compareAtPrice: 3200,
    swatch: ["#e8e4dc", "#8c8f8a"],
  },
  {
    id: "oak-tray",
    name: "Oak Serving Tray",
    blurb: "Solid white oak with a hand-rubbed oil finish.",
    price: 6400,
    swatch: ["#c99b6a", "#7a5532"],
  },
  {
    id: "wool-blanket",
    name: "Merino Blanket",
    blurb: "Woven in Portugal from fine merino wool.",
    price: 14800,
    compareAtPrice: 18500,
    swatch: ["#7d8f7a", "#3f5040"],
  },
  {
    id: "brass-candle",
    name: "Brass Candlestick",
    blurb: "Solid cast brass that patinas with age.",
    price: 3800,
    swatch: ["#e0c47a", "#9c7a2e"],
  },
  {
    id: "glass-carafe",
    name: "Glass Carafe",
    blurb: "Mouth-blown borosilicate, 1 litre.",
    price: 4200,
    swatch: ["#cfe0e3", "#7fa3aa"],
  },
];

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
