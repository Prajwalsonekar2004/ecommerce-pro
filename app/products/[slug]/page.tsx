import { notFound } from "next/navigation";

import { getProductBySlug } from "@/services/product.service";
import { ProductGallery, ProductInfo } from "@/components/product/details";

import ProductActions from "@/components/product/details/ProductActions";
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
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 lg:py-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <ProductGallery product={product} />

          <div className="pt-1">
            <ProductInfo product={product} />

            <ProductActions product={product} />
          </div>
        </div>

        <section className="mt-16 border-t border-neutral-200 pt-12">
          <SimilarProducts currentProduct={product} />
        </section>
      </div>
    </main>
  );
}
