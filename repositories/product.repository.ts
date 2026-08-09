import { prisma } from "@/lib/prisma";
import { ProductFilters } from "@/types/product-filter";

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

function getOrderBy(sort?: string) {
  switch (sort) {
    case "featured":
      return {
        isFeatured: "desc" as const,
      };

    case "price-low":
      return {
        price: "asc" as const,
      };

    case "price-high":
      return {
        price: "desc" as const,
      };

    case "newest":
    default:
      return {
        createdAt: "desc" as const,
      };
  }
}

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

      ...(filters.search && {
        OR: [
          {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(filters.category && {
        category: {
          slug: filters.category,
        },
      }),

      ...(filters.brand && {
        brand: {
          slug: filters.brand,
        },
      }),
    },

    include: productInclude,

    orderBy: getOrderBy(filters.sort),
  });
}
