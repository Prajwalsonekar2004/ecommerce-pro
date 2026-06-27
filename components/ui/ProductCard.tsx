type ProductCardProps = {
  name: string;
  price: number;
};

export default function ProductCard({
  name,
  price,
}: Readonly<ProductCardProps>) {
  return (
    <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 rounded-lg mb-4 "></div>

      <h3 className="text-xl font-semibold ">{name}</h3>

      <p className="mt-2 text-gray-600">₹{price.toLocaleString("en-IN")}</p>

      <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg">
        Add To Cart
      </button>
    </div>
  );
}
