import SectionHeader from "../common/SectionHeader";
import ProductCarousel from "../product/ProductCarousel";
import { getProducts } from "@/services/product.service";

export default function NewArrivals() {
  const products = getProducts({
    newArrival: true,
  });

  return (
    <section className="mx-auto max-w-[1440px] px-8 py-24">
      <SectionHeader
        title="New Arrivals"
        description="Fresh drops this week."
        href="/products/new"
      />

      <ProductCarousel products={products} />
    </section>
  );
}
