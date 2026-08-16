import { notFound } from "next/navigation";

import ProductGrid from "@/components/product/ProductGrid";
import { searchProducts } from "@/services/product.service";

interface Props {
  params: Promise<{
    gender: string;
  }>;
}

const genderMap = {
  men: "MEN",
  women: "WOMEN",
} as const;

export default async function GenderProductsPage({ params }: Props) {
  const { gender } = await params;

  const selectedGender = genderMap[gender as keyof typeof genderMap];

  if (!selectedGender) {
    notFound();
  }

  const products = await searchProducts({
    gender: selectedGender,
    sort: "newest",
  });

  const title = selectedGender === "MEN" ? "Men" : "Women";

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-[1440px] px-6 py-10 sm:px-8 lg:px-12">
        <div className="border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {products.length} products
          </p>
        </div>

        <div className="pt-8">
          {products.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-sm text-neutral-500">No products found.</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>
    </main>
  );
}
