import ProductSection from "../product/ProductSection";
import { getProducts } from "@/services/product.service";

export default function FeaturedProducts() {
  const products = getProducts({
    featured: true,
  });

  return (
    <ProductSection
      title="Featured Products"
      description="Our most popular styles."
      href="products"
      products={products}
    />
  );
}
