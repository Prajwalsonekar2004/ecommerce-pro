import Image from "next/image";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductGallery({ product }: Props) {
  return (
    <div className="grid gap-4">
      {product.images.map((image) => (
        <div key={image} className="overflow-hidden rounded-3xl bg-neutral-100">
          <Image
            src={image}
            alt={product.name}
            width={900}
            height={1200}
            className="w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
