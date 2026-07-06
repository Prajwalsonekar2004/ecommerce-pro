import Image from "next/image";
import { Product } from "@/types/product";

type ProductImageProps = {
  product: Product;
};

export default function ProductImage({ product }: ProductImageProps) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover transition duration-300 hover:scale-105"
      />
    </div>
  );
}
