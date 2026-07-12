import SectionHeader from "../common/SectionHeader";
import Link from "next/link";
import { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";

type ProductSectionProps = {
  title: string;
  description: string;
  products: Product[];
  href: string;
};

export default function ProductSection({
  title,
  description,
  products,
  href,
}: ProductSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader title={title} description={description} href={href} />

      <ProductSlider>
        <ProductGrid products={products} />
      </ProductSlider>
    </section>
  );
}
