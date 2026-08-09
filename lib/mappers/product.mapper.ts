import { Prisma, Gender } from "@prisma/client";
import { Product } from "@/types/product";

type PrismaProduct = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    category: true;
    images: true;
    colors: true;
    sizes: true;
  };
}>;

export function mapProduct(product: PrismaProduct): Product {
  const price = Number(product.price);

  const comparePrice =
    product.comparePrice !== null ? Number(product.comparePrice) : undefined;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,

    price,
    comparePrice,

    brand: product.brand.name,
    category: product.category.name,

    gender:
      product.gender === Gender.MEN
        ? "Men"
        : product.gender === Gender.WOMEN
          ? "Women"
          : "Kids",

    collection: product.collection ?? undefined,

    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,

    images: product.images.map((img) => img.url),
    colors: product.colors.map((color) => color.name),
    sizes: product.sizes.map((size) => size.size.toString()),

    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isTrending: product.isTrending,

    isOnSale: comparePrice !== undefined && comparePrice > price,
  };
}
