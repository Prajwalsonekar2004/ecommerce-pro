import { findProductBySlug } from "@/repositories/product.repository";
import { mapProduct } from "@/lib/mappers/product.mapper";
import { findProducts } from "@/repositories/product.repository";
import { findAllProducts } from "@/repositories/product.repository";

export async function getProducts(filters?: {
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
}) {
  const products = await findProducts(filters);

  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await findProductBySlug(slug);

  if (!product) return null;
  return mapProduct(product);
}

export async function getAllProducts() {
  const products = await findAllProducts();

  return products.map(mapProduct);
}
