import Image from "next/image";
import { Product } from "@/types/product";

type ProductImageProps = {
  product: Product;
};

export default function ProductImage({ product }: ProductImageProps) {
  const image = product.images?.[0] || "/images/products/placeholder.jpg";

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-t-[28px] bg-neutral-100">
      <Image
        src={image}
        alt={product.name}
        fill
        sizes="(max-width:768px) 50vw, (max-width:1280px) 33vw, 25vw"
        className="
          object-cover
          transition-transform
          duration-700
          ease-out
          group-hover:scale-110
        "
      />

      {/* Premium Gradient */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-28
          bg-gradient-to-t
          from-black/20
          to-transparent
          opacity-0
          transition
          duration-500
          group-hover:opacity-100
        "
      />
    </div>
  );
}
