import ProductCarousel from "../product/ProductCarousel";
import SectionHeader from "../common/SectionHeader";
import { getProducts } from "@/services/product.service";

export default function FeaturedProducts() {
  const products = getProducts({
    featured: true,
  });

  return (
    <section className="mx-auto max-w-[1440px] px-8 py-24">
      <SectionHeader
        title="Featured Products"
        description="Handpicked styles loved by thousands."
        href="/products"
      />

      <ProductCarousel products={products} />
    </section>
  );
}