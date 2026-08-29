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
      <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-6 lg:py-10">
        <div className="grid items-start gap-7 lg:grid-cols-[520px_minmax(0,1fr)]">
          {/* Product gallery */}
          <ProductGallery product={product} />

          {/* Product details */}
          <div className="min-w-0 pt-1">
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
