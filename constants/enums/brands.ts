export const BRANDS = {
  BLACKHEADFASHION: "Blackheadfashion",
  NIKE: "Nike",
  ADIDAS: "Adidas",
  PUMA: "Puma",
} as const;

export type Brand = (typeof BRANDS)[keyof typeof BRANDS];
