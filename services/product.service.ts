import { products } from "@/constants/data/products";
import { Product } from "@/types/product";

export function getAllProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isFeatured);
}

export function getNewArrivals(): Product[] {
  return products.filter((product) => product.isNewArrival);
}

export function getTrendingProducts(): Product[] {
  return products.filter((product) => product.isTrending);
}

export function getProductBySlug(slug: string): Product[] {
  return products.find((product) => product.slug === slug);
}
