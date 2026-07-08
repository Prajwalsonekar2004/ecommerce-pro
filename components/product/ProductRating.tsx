type ProductRatingProps = {
  rating: number;
  reviewCount: number;
};

export default function ProductRating({
  rating,
  reviewCount,
}: ProductRatingProps) {
  return (
    <p className="mt-2 text-sm text-gray-500">
      ⭐ {rating} ({reviewCount} Reviews)
    </p>
  );
}
