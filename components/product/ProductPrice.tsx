import { formatCurrency } from "@/lib/format";

type Props = {
  price: number;
  comparePrice?: number;
};

export default function ProductPrice({ price, comparePrice }: Props) {
  if (!comparePrice) {
    return (
      <p className="font-semibold text-neutral-900">{formatCurrency(price)}</p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-semibold text-neutral-900">
        {formatCurrency(price)}
      </span>

      <span className="text-neutral-400 line-through">
        {formatCurrency(comparePrice)}
      </span>
    </div>
  );
}
