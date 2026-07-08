import { Product } from "@/types/product";
import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">{product.brand}</p>

      <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>

      <ProductPrice
      price={product.price}
      discountPrice={product.discountPrice}
      />

      <ProductRating
      rating={product.rating}
      reviewCount={product.reviewCount}
      />
    </div>
  );
}
