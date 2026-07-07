export const CATEGORIES = {
  TSHIRTS: "T-Shirts",
  SHIRTS: "Shirts",
  HOODIES: "Hoodies",
  JEANS: "Jeans",
  JACKETS: "Jackets",
  SHOES: "Shoes",
  ACCESSORIES: "Accessories",
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];
