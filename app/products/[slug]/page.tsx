import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product.service";
import { ProductGallery, ProductInfo } from "@/components/product/details";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-10">
      <div className="grid gap-16 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>
      <SimilarProducts />
    </main>
  );
}
