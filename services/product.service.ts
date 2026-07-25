import { mapProduct } from "@/lib/mappers/product.mapper";
import { findProducts } from "@/repositories/product.repository";

export async function getProducts(filters?: {
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
}) {
  const products = await findProducts(filters);

  return products.map(mapProduct);
}
