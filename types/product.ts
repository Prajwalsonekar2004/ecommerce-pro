import { NewArrivals } from "@/components/home/NewArrivals";
import { Product } from "@/types/product";
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  rating: number;
  image: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
  discountPrice?: number;
  gender: "Men" | "Women" | "Kids";
  collection: string;
}

export interface ProductFilters {
  gender?: "Men" | "Women" | "Kids";
  category?: string;
  collection?: string;
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
}
