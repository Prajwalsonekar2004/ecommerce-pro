import Link from "next/link";
import { Product } from "@/types/product";
import ProductBadge from "./ProductBadge";
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
        <div className="relative overflow-hidden">
          <ProductBadge discountPrice={product.comparePrice} />

          <ProductImage product={product} />
        </div>

        <ProductInfo product={product} />
      </Link>

      <div className="px-5 pb-5"></div>
    </article>
  );
}
