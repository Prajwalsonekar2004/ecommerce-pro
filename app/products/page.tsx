import ProductGrid from "@/components/product/ProductGrid";
import ProductToolbar from "@/components/product/ProductToolbar";
import FilterSidebar from "@/components/product/FilterSidebar";
import Pagination from "@/components/product/Pagination";

import { searchProducts } from "@/services/product.service";
import { getBrands } from "@/services/brand.service";
import { getCategories } from "@/services/category.service";

import { ProductFilters } from "@/types/product-filter";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string;
    size?: string;
    sort?: ProductFilters["sort"];
    page?: string;
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
    color: params.color,
    size: params.size,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sort: params.sort ?? "newest",
    page: Number(params.page ?? 1),
    limit: 12,
  };

  const [products, brands, categories] = await Promise.all([
    searchProducts(filters),
    getBrands(),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
            BlackHeadFashion
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
            Premium Collection
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600 md:text-lg">
            Discover timeless fashion designed for confidence, comfort and
            everyday style. Explore our latest premium essentials crafted with
            quality fabrics and modern silhouettes.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
        <ProductToolbar />

        <div className="mt-10 grid gap-10 lg:grid-cols-[290px_1fr]">
          <FilterSidebar brands={brands} categories={categories} />

          <section>
            {products.length === 0 ? (
              <div className="flex h-[500px] items-center justify-center rounded-3xl border border-neutral-200 bg-white">
                <h2 className="text-2xl font-semibold text-neutral-700">
                  No Products Found
                </h2>
              </div>
            ) : (
              <>
                <ProductGrid products={products} />

                <div className="mt-16">
                  <Pagination />
                </div>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
