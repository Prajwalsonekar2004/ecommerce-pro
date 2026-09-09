import ProductForm, {
  type ProductFormValues,
} from "@/components/admin/ProductForm";

import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== "ADMIN") {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      sizes: true,
    },
  });

  if (!product) {
    notFound();
  }

  const initialValues: Partial<ProductFormValues> = {
    name: product.name,
    sku: product.sku,
    slug: product.slug,
    collection: product.collection ?? "",
    categoryId: product.categoryId,
    brandId: product.brandId,
    gender: product.gender,
    description: product.description,
    price: product.price.toString(),
    comparePrice: product.comparePrice?.toString() ?? "",
    stock: String(product.stock),
    material: product.material ?? "",
    fit: product.fit ?? "",
    pattern: product.pattern ?? "",
    careInstructions: product.careInstructions ?? "",
    thumbnail: product.thumbnail ?? "",
    selectedSizes: product.sizes.map(
      (item) => item.size,
    ) as ProductFormValues["selectedSizes"],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isTrending: product.isTrending,
    isOnSale: product.isOnSale,
  };

  return (
    <ProductForm
      mode="edit"
      productId={product.id}
      initialValues={initialValues}
    />
  );
}
