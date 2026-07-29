import ProductSearch from "./ProductSearch";
import ProductSort from "./ProductSort";

interface ProductToolbarProps {
  totalProducts: number;
}

export default function ProductToolbar({ totalProducts }: ProductToolbarProps) {
  return (
    <div className="mb-8 flex items-center justify-between border-b pb-4">
      <ProductSearch />

      <ProductSort />
    </div>
  );
}
