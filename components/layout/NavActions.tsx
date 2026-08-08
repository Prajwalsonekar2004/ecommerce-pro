"use client";

import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export default function NavActions() {
  const { itemCount } = useCart();

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        aria-label="Search"
        className="transition hover:opacity-60"
      >
        <Search size={22} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        aria-label="Wishlist"
        className="transition hover:opacity-60"
      >
        <Heart size={22} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        aria-label="Shopping bag"
        className="relative transition hover:opacity-60"
      >
        <ShoppingBag size={22} strokeWidth={1.8} />

        {itemCount > 0 && (
          <span
            className="absolute -right-2 -top-2n flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold
              text-white
            "
          >
            {itemCount}
          </span>
        )}
      </button>

      <button
        type="button"
        aria-label="Account"
        className="transition hover:opacity-60"
      >
        <User size={22} strokeWidth={1.8} />
      </button>
    </div>
  );
}
