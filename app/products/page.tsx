import { getAllProducts } from "@/services/product.service";
import ProductGrid from "@/components/product/ProductGrid";

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
      <h1 className="mb-8 text-4xl font-bold">All Products</h1>

      <ProductGrid products={products} />
    </main>
  );
}
