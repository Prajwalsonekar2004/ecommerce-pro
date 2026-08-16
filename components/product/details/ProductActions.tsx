"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Product } from "@/types/product";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";

import ColorSelector from "./options/ColorSelector";
import SizeSelector from "./options/SizeSelector";
import QuantitySelector from "./options/QuantitySelector";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");

  const [quantity, setQuantity] = useState(1);

  const wishlisted = isInWishlist(product.id);
  const isAvailable = product.stock > 0;

  function handleAddToBag() {
    if (!isAvailable) return;
    if (!selectedSize) return;

    addToCart(product, selectedSize, quantity);
  }

  return (
    <div className="mt-8 space-y-7">
      <ColorSelector
        colors={product.colors}
        selectedColor={selectedColor}
        onChange={setSelectedColor}
      />

      <SizeSelector
        sizes={product.sizes}
        selectedSize={selectedSize}
        onChange={setSelectedSize}
      />

      <QuantitySelector
        quantity={quantity}
        stock={product.stock}
        onChange={setQuantity}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToBag}
          disabled={!isAvailable}
          className="flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
        >
          <ShoppingBag size={18} strokeWidth={1.8} />

          {isAvailable ? "Add to Bag" : "Out of Stock"}
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 transition hover:border-black"
        >
          <Heart
            size={20}
            strokeWidth={1.8}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>
    </div>
  );
}
