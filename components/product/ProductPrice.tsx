import { formatCurrency } from "@/lib/format";

type ProductPriceProps = {
  price: number;
  discountPrice?: number;
};

export default function ProductPrice({
  price,
  discountPrice,
}: ProductPriceProps) {
  if (!discountPrice) {
    return <p className="text-lg font-semibold">{formatCurrency(price)}</p>;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-lg font-semibold">
        {formatCurrency(discountPrice)}
      </span>

      <span className="text-gray-400 line-through">
        {formatCurrency(price)}
      </span>
    </div>
  );
}
