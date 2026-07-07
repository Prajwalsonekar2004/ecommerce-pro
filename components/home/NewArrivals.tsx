import ProductSection from "../product/ProductSection";
import { getProducts } from "@/services/product.service";

export default function NewArrivals() {
  const products = getProducts({
    newArrival: true,
  });

  return (
    <ProductSection
      title="New Arrivals"
      description="Fresh arrivals just for you"
      href="/products/new-arrivals"
      products={products}
    />
  );
}
