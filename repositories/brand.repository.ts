import { prisma } from "@/lib/prisma";

export async function findBrands() {
  return prisma.brand.findMany({
    where: {
      isActive: true,
    },

    orderBy: {
      name: "asc",
    },
  });
}
