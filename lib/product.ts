import { products } from "./../constants/data/products";
import { Product } from "@/types/product";

export function getUniqueCategories(products: Product[]) {
  return [...new Set(products.map((product) => product.category))];
}