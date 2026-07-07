import { Brand } from "@/constants/enums/brands";
import { Category } from "@/constants/enums/categories";

export interface Product {
  id: number;

  name: string;
  slug: string;
  description: string;

  price: number;
  discountPrice?: number;

  brand: Brand;
  category: Category;

  gender: "Men" | "Women" | "Kids";
  collection: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
}

export interface ProductFilters {
  gender?: "Men" | "Women" | "Kids";
  category: Category;
  collection?: string;
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
}
