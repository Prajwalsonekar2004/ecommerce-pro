import ProductGrid from "../product/ProductGrid";
import { getFeaturedProducts } from "@/services/product.service";

export default function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10">
        <h2 className="text-4xl font-bold">Featured Products</h2>

        <p className="mt-2 text-gray-500">Our most popular styles.</p>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}

const products = getProducts({
  featured: true,
});
