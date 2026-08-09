"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag, User } from "lucide-react";

import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";

export default function NavActions() {
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();

  return (
    <div className="flex items-center gap-5">
      <Link
        href="/products"
        aria-label="Search products"
        className="text-neutral-900 transition hover:text-neutral-500"
      >
        <Search size={22} strokeWidth={1.8} />
      </Link>

      <Link
        href="/wishlist"
        aria-label={
          wishlistItemCount > 0
            ? `Wishlist, ${wishlistItemCount} items`
            : "Wishlist"
        }
        className="relative text-neutral-900 transition hover:text-neutral-500"
      >
        <Heart size={22} strokeWidth={1.8} />

        {wishlistItemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
            {wishlistItemCount}
          </span>
        )}
      </Link>

      <Link
        href="/cart"
        aria-label={
          cartItemCount > 0
            ? `Shopping bag, ${cartItemCount} items`
            : "Shopping bag"
        }
        className="relative text-neutral-900 transition hover:text-neutral-500"
      >
        <ShoppingBag size={22} strokeWidth={1.8} />

        {cartItemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
            {cartItemCount}
          </span>
        )}
      </Link>

      <Link
        href="/profile"
        aria-label="Account"
        className="text-neutral-900 transition hover:text-neutral-500"
      >
        <User size={22} strokeWidth={1.8} />
      </Link>
    </div>
  );
}
