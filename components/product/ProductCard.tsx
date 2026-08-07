import Link from "next/link";
import { Product } from "@/types/product";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      {/* Wishlist */}
      <Link href={`/products/${product.slug}`}>
        <article className="group">
          <ProductImage product={product} />
          <ProductInfo product={product} />
        </article>
      </Link>
    </article>
  );
}
