import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product.service";
import { ProductGallery, ProductInfo } from "@/components/product/details";
import SimilarProducts from "@/components/product/details/SimilarProducts";

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
    <main className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>
      <section className="mt-24">
        <SimilarProducts currentProduct={product} />
      </section>
    </main>
  );
}
