type ProductBadgeProps = {
  discountPrice?: number;
};

export default function ProductBadge({ discountPrice }: ProductBadgeProps) {
  if (!discountPrice) return null;

  return (
    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
      SALE
    </span>
  );
}
