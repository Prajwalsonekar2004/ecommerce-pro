import Link from "next/link";
import { Heart, Eye } from "lucide-react";

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
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        bg-white
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* Wishlist */}

      <button
        className="
          absolute
          right-4
          top-4
          z-20
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white/90
          opacity-0
          shadow-md
          backdrop-blur
          transition-all
          duration-300
          group-hover:opacity-100
        "
      >
        <Heart size={18} />
      </button>

      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden">
          <ProductBadge discountPrice={product.comparePrice} />

          <ProductImage product={product} />

          {/* Quick View */}

          <div
            className="
              absolute
              inset-x-6
              bottom-6
              translate-y-8
              opacity-0
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <button
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-white
                text-sm
                font-semibold
                shadow-lg
              "
            >
              <Eye size={16} />
              Quick View
            </button>
          </div>
        </div>

        <ProductInfo product={product} />
      </Link>

      <div className="px-5 pb-5">
        <AddToCartButton />
      </div>
    </article>
  );
}
