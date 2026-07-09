import { products } from "@/constants/data/products";
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
