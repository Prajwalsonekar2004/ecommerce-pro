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
      ...(filters?.newArrival && { isNewArrivals: true }),
      ...(filters?.trending && { isTrending: true }),
    },

    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
      sizes: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
