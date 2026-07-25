import ProductCarousel from "../product/ProductCarousel";
import SectionHeader from "../common/SectionHeader";
import { getProducts } from "@/services/product.service";

export default async function TrendingCollection() {
  const products = await getProducts({
    trending: true,
  });
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-24">
      <SectionHeader
        title="Trending Collection"
        description="Most loved pieces right now."
        href="/products/trending"
      />

      <ProductCarousel products={products} />
    </section>
  );
}
