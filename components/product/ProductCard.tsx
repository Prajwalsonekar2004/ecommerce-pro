import Link from "next/link";
import { Product } from "@/types/product";

import ProductBadge from "./ProductBadge";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductImage from "./ProductImage";
import { link } from "fs";
import AddToCartButton from "./AddToCartButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={"/products/${product.slug"}>
      <article className="group">
        <div className="relative">
          <ProductBadge discountPrice={product.discountPrice} />

          <ProductImage product={product} />
        </div>

        <ProductInfo product={product} />

        <AddToCartButton />
      </article>
    </Link>
  );
}
