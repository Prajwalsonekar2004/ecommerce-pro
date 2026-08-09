"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

import { Product } from "@/types/product";
import { useWishlist } from "@/lib/wishlist/wishlist-context";

interface Props {
  product: Product;
}

export default function ProductImage({ product }: Props) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const image = product.images?.[0];
  const isWishlisted = isInWishlist(product.id);

  function handleWishlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist(product);
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
      {image ? (
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="object-cover"
          priority
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400"
          aria-label="Product image unavailable"
        >
          Image unavailable
        </div>
      )}

      <button
        type="button"
        aria-label={
          isWishlisted
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        aria-pressed={isWishlisted}
        onClick={handleWishlist}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm transition hover:scale-105 hover:bg-neutral-50 active:scale-95"
      >
        <Heart
          size={20}
          strokeWidth={1.8}
          fill={isWishlisted ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
}
