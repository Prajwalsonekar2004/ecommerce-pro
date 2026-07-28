interface ProductToolbarProps {
  totalProducts: number;
}

export default function ProductToolbar({ totalProducts }: ProductToolbarProps) {
  return (
    <div className="mb-8 flex items-center justify-between border-b pb-4">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>

        <p className="mt-1 text-sm text-gray-500">{totalProducts} Products</p>
      </div>

      <div>Sort (Coming Soon)</div>
    </div>
  );
}
