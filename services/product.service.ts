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

export function getProductsByGender(gender: "Men" | "Women" | "Kids") {
  return products.filter((product) => product.gender === gender);
}

export function getProductsByCollection(collection: string) {
  return products.filter((product) => product.collection === collection);
}

import { ProductFilters } from "@/types/product";

export function getProducts(filters: ProductFilters = {}) {
  return products.filter((product) => {
    if (filters.gender && product.gender !== filters.gender) {
      return false;
    }

    if (filters.collection && product.collection !== filters.collection) {
      return false;
    }

    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.featured && !product.isFeatured) {
      return false;
    }

    if (filters.newArrival && !product.isNewArrival) {
      return false;
    }

    if (filters.trending && !product.isTrending) {
      return false;
    }

    return true;
  });
}
