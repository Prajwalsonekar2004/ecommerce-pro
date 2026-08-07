import { formatCurrency } from "@/lib/format";

type ProductPriceProps = {
  price: number;
  comparePrice?: number;
};

export default function ProductPrice({
  price,
  comparePrice,
}: ProductPriceProps) {
  if (!comparePrice) {
    return <p className="text-lg font-semibold">{formatCurrency(price)}</p>;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-black font-semibold line-through">
        {formatCurrency(comparePrice)}
      </span>

      <span className="text-gray-400 ">
        {formatCurrency(price)}
      </span>
    </div>
  );
}
