import { Product } from "@/types/product";
import { BRANDS } from "@/constants/enums/brands";
import { CATEGORIES } from "@/constants/enums/categories";

export const tshirts: Product[] = [
  {
    id: 1001,
    name: "Essential Oversized Tee",
    slug: "essential-oversized-tee-black",

    description:
      "Premium heavyweight oversized t-shirt crafted for everyday comfort.",

    brand: BRANDS.BLACKHEAD,

    category: CATEGORIES.TSHIRTS,

    gender: "Men",

    collection: "Essentials",

    price: 1999,

    discountPrice: 1499,

    sizes: ["S", "M", "L", "XL"],

    colors: ["Black", "White", "Beige"],

    images: [
      "/images/products/tshirts/essential-oversized/front.webp",
      "/images/products/tshirts/essential-oversized/back.webp",
      "/images/products/tshirts/essential-oversized/model.webp",
      "/images/products/tshirts/essential-oversized/side.webp",
    ],

    stock: 34,

    rating: 4.9,

    reviewCount: 248,

    isFeatured: true,

    isNewArrival: true,

    isTrending: true,
  },
  {
    id:1002,

    name:"Classic Heavy Tee",

    slug:"classic-heavy-tee-white",

    description:"Minimal heavyweight cotton t-shirt designed for daily wear.",

    brand:BRANDS.BLACKHEAD,

    category:CATEGORIES.TSHIRTS,

    gender:"Men",

    collection:"Core",

    price:1799,

    discountPrice:1399,

    sizes:["S","M","L","XL"],

    colors:["White","Black"],

    images:[
"/images/products/tshirts/classic-heavy/front.webp",
"/images/products/tshirts/classic-heavy/back.webp",
"/images/products/tshirts/classic-heavy/model.webp",
"/images/products/tshirts/classic-heavy/side.webp",
],

stock:52,

rating:4.8,

reviewCount:193,

isFeatured:true,

isNewArrival:false,

isTrending:true,
},
];