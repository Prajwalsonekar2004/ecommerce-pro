export const BRANDS = {
  ECOMMERCE_PRO: "Ecommerce Pro",
  NIKE: "Nike",
  ADIDAS: "Adidas",
  PUMA: "Puma",
  LEVIS: "Levi's",
  DENIM: "Denim",
  FOX: "Fox",
  SUD: "Sud",
  HORNET: "Hornet",
} as const;

export type Brand = (typeof BRANDS)[keyof typeof BRANDS];
