import { tshirts } from "./tshirts";
import { Product } from "@/types/product";

export const tshirts: Product[] = [
  {
    id: 1,
    name: "Essential Cotton T-Shirt",
    slug: "essential-cotton-tshirt",
    description: "Soft premium cotton t-shirt for everyday comfort.",
    price: 1499,
    discountPrice: 1199,
    brand: "Ecommerce Pro",
    gender: "Men",
    category: "T-Shirts",
    collection: "Essentials",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    images: [
      "/images/products/tshirts/tshirt-1-front.jpg",
      "/images/products/tshirts/tshirt-1-back.jpg",
    ],
    stock: 25,
    rating: 4.8,
    reviewCount: 142,
    isFeatured: true,
    isNewArrival: true,
    isTrending: false,
  },
];
