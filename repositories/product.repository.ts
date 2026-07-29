import { mapProduct } from "@/lib/mappers/product.mapper";
import { products } from "./../constants/data/products/index";
import { ProductFilters } from "./../types/product";
import { prisma } from "@/lib/prisma";

const productInclude = {
  brand: true,
  category: true,

  images: {
    orderBy: {
      displayOrder: "asc",
    },
  },

  colors: {
    orderBy: {
      displayOrder: "asc",
    },
  },

  sizes: true,
} as const;

export async function findProducts(filters?: {
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
}) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(filters?.featured && { isFeatured: true }),
      ...(filters?.newArrival && { isNewArrival: true }),
      ...(filters?.trending && { isTrending: true }),
    },

    include: productInclude,

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: {
      slug,
      isActive: true,
    },

    include: productInclude,
  });
}

export async function findAllProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },

    include: productInclude,

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findProductsWithFilters(filters: ProductFilters) {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: productInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function searchProducts(filters: ProductFilters) {
  const products = await findProductsWithFilters(filters);
  return products.map(mapProduct);
}
