export interface ProductFilters {
  search?: string;
  brand?: string;
  category?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "price-low" | "price-high" | "name";
}
