export const BRANDS = {
  ECOMMERCE_PRO: "Ecommerce Pro",
  NIKE: "Nike",
  ADIDAS: "Adidas",
  PUMA: "Puma",
  LEVIS: "Levi's",
} as const;

export type Brand = (typeof BRANDS)[keyof typeof BRANDS];
