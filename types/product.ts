import { NewArrivals } from "@/components/home/NewArrivals";
import { Product } from "@/types/product";

export interface Product {
  id: number;

  name: string;
  slug: string;
  description: string;

  price: number;
  discountPrice?: number;

  brand: string;

  gender: "Men" | "Women" | "Kids";
  category: string;
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
  category?: string;
  collection?: string;
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
}
