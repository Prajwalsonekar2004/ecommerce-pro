import { prisma } from "@/lib/prisma";

export async function findCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },

    orderBy: {
      name: "asc",
    },
  });
}
