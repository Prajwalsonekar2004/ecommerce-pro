import Link from "next/link";
import { Product } from "@/types/product";
import ProductBadge from "./ProductBadge";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import AddToCartButton from "./AddToCartButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <article className="group transition-all duration-500 hover:-translate-y-2">
        <div className="group-hover:scale-105 duration-700">
          <ProductBadge discountPrice={product.discountPrice} />

          <ProductImage product={product} />
        </div>

        <ProductInfo product={product} />

        <AddToCartButton />
      </article>
    </Link>
  );
}
