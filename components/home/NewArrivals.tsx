import ProductCarousel from "../product/ProductCarousel";
import SectionHeader from "../common/SectionHeader";
import { getProducts } from "@/services/product.service";

export default async function NewArrivals() {
  const products = await getProducts({
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
