import { Product } from "@/types/product";
import formatCurrency from "@/lib/format";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: Readonly<ProductCardProps>) {
  return (
    <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 rounded-lg mb-4 "></div>

      <h3 className="text-xl font-semibold ">{product.name}</h3>

      <p className="mt-2 text-gray-600">
        {formatCurrency(product.price)}
      </p>

      <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg">
        Add To Cart
      </button>

      <p className="text-sm text-gray-500 mt-2">{product.category}</p>

      <p className="text-yellow-500">⭐ {product.rating}</p>
    </div>
  );
}
