import Link from "next/link";

import { Product } from "@/types/product";

import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group min-w-0">
      <Link href={`/products/${product.slug}`} className="block">
        <ProductImage product={product} />
        <ProductInfo product={product} />
      </Link>
    </article>
  );
}
