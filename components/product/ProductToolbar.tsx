import ProductSearch from "./ProductSearch";
import ProductSort from "./ProductSort";

interface ProductToolbarProps {
  totalProducts: number;
}

export default function ProductToolbar({ totalProducts }: ProductToolbarProps) {
  return (
    <div className="flex items-center gap-4">
      <ProductSearch />

      <ProductSort />
    </div>
  );
}
