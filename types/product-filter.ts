export interface ProductFilters {
  search?: string;
  brand?: string;
  category?: string;
  color?: string;
  size?: string;
  gender?: "MEN" | "WOMEN";

  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;

  sort?: "featured" | "newest" | "price-low" | "price-high";

  page?: number;
  limit?: number;
}
