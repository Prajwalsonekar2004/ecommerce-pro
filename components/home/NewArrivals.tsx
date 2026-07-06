import ProductGrid from "../product/ProductGrid";
import { getProducts } from "@/services/product.service";

export default function NewArrivals() {
  const products = getProducts({
    newArrival: true,
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10">
        <h2 className="text-4xl font-bold">New Arrivals</h2>

        <p className="mt-2 text-gray-500">Fresh arrivals just for you.</p>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}

const Products = getProducts({
  newArrival: true,
});
