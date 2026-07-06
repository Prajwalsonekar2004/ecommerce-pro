import { Product } from "@/types/product";
import formatCurrency from "@/lib/format";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">{product.brand}</p>

      <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>

      <div className="mt-2 flex item-centre gap-3">
        {product.discountPrice && (
          <span className="font-bold">
            {formatCurrency(product.discountPrice)}
          </span>
        )}

        <span
          className={
            product.discountPrice ? "text-gray-400 line-through" : "font-bold"
          }
        ></span>
      </div>
    </div>
  );
}
