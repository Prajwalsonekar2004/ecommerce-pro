import { findCategories } from "@/repositories/category.repository";

export async function getCategories() {
  return findCategories();
}
