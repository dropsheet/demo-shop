export type Product = {
  id: string;
  name: string;
  maker: string;
  blurb: string;
  /** Price in US cents. */
  price: number;
  /** Price before a discount, in US cents. Set only on discounted products. */
  compareAtPrice?: number;
  /** Background colour behind the product artwork. */
  backdrop: string;
};

export const products: Product[] = [
  {
    id: "linen-throw",
    name: "Stonewashed Linen Throw",
    maker: "Atelier Lune, Lithuania",
    blurb: "Heavyweight European flax, washed until it drapes like an old shirt.",
    price: 8900,
    backdrop: "#e9dfd2",
  },
  {
    id: "ceramic-mug",
    name: "Speckled Stoneware Mug",
    maker: "Hollow Clay Studio, Oregon",
    blurb: "Hand-thrown and glazed in oatmeal speckle. Holds a generous 12 oz.",
    price: 2400,
    compareAtPrice: 3200,
    backdrop: "#dfe3dc",
  },
  {
    id: "oak-tray",
    name: "White Oak Serving Tray",
    maker: "Northfold Woodshop, Vermont",
    blurb: "Solid quartersawn oak with carved handles and a hand-rubbed oil finish.",
    price: 6400,
    backdrop: "#efe4d3",
  },
  {
    id: "wool-blanket",
    name: "Merino Herringbone Blanket",
    maker: "Serra Mill, Portugal",
    blurb: "Fine merino woven in a soft herringbone on a 1920s loom.",
    price: 14800,
    compareAtPrice: 18500,
    backdrop: "#d7ddd3",
  },
  {
    id: "brass-candle",
    name: "Cast Brass Candlestick",
    maker: "Foundry Row, Sheffield",
    blurb: "Sand-cast solid brass that warms to a soft patina over the years.",
    price: 3800,
    backdrop: "#ece3cf",
  },
  {
    id: "glass-carafe",
    name: "Mouth-Blown Glass Carafe",
    maker: "Vetro Alto, Murano",
    blurb: "One litre of thin borosilicate glass with a tumbler that doubles as a lid.",
    price: 4200,
    backdrop: "#dde6e6",
  },
];

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
