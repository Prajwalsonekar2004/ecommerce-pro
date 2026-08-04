import { Product } from "@/types/product";
import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-3 p-5">
      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-[0.25em]
          text-neutral-500
        "
      >
        {product.brand}
      </p>

      <h3
        className="
          line-clamp-2
          text-xl
          font-semibold
          leading-snug
          text-neutral-900
        "
      >
        {product.name}
      </h3>

      <ProductPrice price={product.price} comparePrice={product.comparePrice} />

      <ProductRating
        rating={product.rating}
        reviewCount={product.reviewCount}
      />
    </div>
  );
}
