import ProductGrid from "@/components/product/ProductGrid";
import ProductToolbar from "@/components/product/ProductToolbar";
import FilterSidebar from "@/components/product/FilterSidebar";
import Pagination from "@/components/product/Pagination";

import { searchProducts } from "@/services/product.service";
import { ProductFilters } from "@/types/product-filter";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
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
    sort: params.sort,
    page: Number(params.page ?? 1),
    limit: 12,
  };

  const products = await searchProducts(filters);

  if (products.length === 0) {
    return (
      <main className="mx-auto max-w-[1440px] px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold">No products found</h2>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-10">
      <ProductToolbar totalProducts={products.length} />

      <div className="grid grid-cols-12 gap-8">
        <aside className="col-span-3">
          <FilterSidebar />
        </aside>

        <section className="col-span-9">
          <ProductGrid products={products} />
        </section>
      </div>

      <Pagination />
    </main>
  );
}
