import { Product } from "@/types/product";
import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-1 px-1 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {product.brand}
      </p>

      <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-neutral-900">
        {product.name}
      </h3>

      <p className="text-sm text-neutral-500">{product.category}</p>

      <div className="pt-2">
        <ProductPrice
          price={product.price}
          comparePrice={product.comparePrice}
        />
      </div>
    </div>
  );
}
