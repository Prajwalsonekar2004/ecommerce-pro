import { findBrands } from "@/repositories/brand.repository";

export async function getBrands() {
  return findBrands();
}
