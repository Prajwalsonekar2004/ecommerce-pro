import { prisma } from "@/lib/prisma";

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

    include: {
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
    },
  });
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: {
      slug,
      isActive: true,
    },

    include: {
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
    },
  });
}
