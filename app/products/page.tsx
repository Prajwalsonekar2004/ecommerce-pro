import ProductGrid from "@/components/product/ProductGrid";
import ProductToolbar from "@/components/product/ProductToolbar";
import FilterSidebar from "@/components/product/FilterSidebar";

import { searchProducts } from "@/services/product.service";
import { getBrands } from "@/services/brand.service";
import { getCategories } from "@/services/category.service";

import { ProductFilters } from "@/types/product-filter";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    sort?: ProductFilters["sort"];
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const filters: ProductFilters = {
    search: params.search,
    category: params.category,
    brand: params.brand,
    sort: params.sort ?? "newest",
  };

  const [products, brands, categories] = await Promise.all([
    searchProducts(filters),
    getBrands(),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-[1440px] px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-6 border-b border-neutral-200 pb-5">
          <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Products
            </h1>
            <p className="text-sm text-neutral-500">({products.length})</p>
          </div>

          <ProductToolbar />
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
          <FilterSidebar brands={brands} categories={categories} />

          <section className="min-w-0">
            {products.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-medium text-neutral-900">
                    No products found
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    Try another selection.
                  </p>
                </div>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
