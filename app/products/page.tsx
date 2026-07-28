import { getAllProducts } from "@/services/product.service";
import ProductGrid from "@/components/product/ProductGrid";
import ProductToolbar from "@/components/product/ProductToolbar";
import FilterSidebar from "@/components/product/FilterSidebar";
import Pagination from "@/components/product/Pagination";

export default async function ProductsPage() {
  const products = await getAllProducts();

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
