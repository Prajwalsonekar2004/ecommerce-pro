import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductImage({ product }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-neutral-100">
      <Image
        src={product.images[0]}
        alt={product.name}
        width={700}
        height={900}
        sizes="(max-width:768px) 50vw, (max-width:1280px) 33vw, 25vw"
        className="aspect-[3/4] h-auto w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-sm transition hover:bg-white">
        <Heart size={18} />
      </button>
    </div>
  );
}
