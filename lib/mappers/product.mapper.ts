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
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice
      ? Number(product.comparePrice)
      : undefined,
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
    colors: product.colors.map((c) => c.name),
    sizes: product.sizes.map((s) => s.size),
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isTrending: product.isTrending,
  };
}
