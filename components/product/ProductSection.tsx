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
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold">{title}</h2>

          <p className="mt-2 text-gray-500">{description}</p>
        </div>

        <Link href={href} className="font-medium hover:underline">
          View All
        </Link>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
