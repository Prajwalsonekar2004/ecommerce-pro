import { products } from "@/constants/data/products";
import ProductCard from "../ui/ProductCard";

export default function FeaturedProducts() {
  return (
    <section className="py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}/>
        ))}
      </div>
    </section>
  );
}
