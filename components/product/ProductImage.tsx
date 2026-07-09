import Image from "next/image";
import { Product } from "@/types/product";

type ProductImageProps = {
  product: Product;
};

export default function ProductImage({ product }: ProductImageProps) {
  const image = product.images?.[0] || "/images/placeholder.jpg";

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
      <Image
        src={image}
        alt={product.name}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
  );
}