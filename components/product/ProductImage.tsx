"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/lib/cart/cart-context";

interface Props {
  product: Product;
}

export default function ProductImage({ product }: Props) {
  const { addToCart } = useCart();

  const image = product.images?.[0];

  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!image) return;

    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image,
    });
  }

  return (
    <div className="group relative overflow-hidden bg-neutral-100">
      {image ? (
        <Image
          src={image}
          alt={product.name}
          width={700}
          height={900}
          className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="aspect-[3/4] w-full bg-neutral-100" />
      )}

      <button
        type="button"
        aria-label={`Add ${product.name} to cart`}
        onClick={handleAddToCart}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm
          transition
          hover:scale-105
          hover:bg-neutral-50
          active:scale-95
        "
      >
        <Heart size={20} strokeWidth={1.8} />
      </button>
    </div>
  );
}
