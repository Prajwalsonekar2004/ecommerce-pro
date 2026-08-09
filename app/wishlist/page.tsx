"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { useCart } from "@/lib/cart/cart-context";

export default function WishlistPage() {
  const { items, itemCount, isHydrated, removeFromWishlist } = useWishlist();

  const { addToCart } = useCart();

  function handleAddToBag(product: (typeof items)[number]) {
    addToCart(product, 1);
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-[1440px] px-6 py-12 sm:px-8 lg:px-12">
          <div className="h-8 w-48 animate-pulse bg-neutral-100" />

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[4/5] animate-pulse bg-neutral-100" />
                <div className="mt-4 h-4 w-2/3 animate-pulse bg-neutral-100" />
                <div className="mt-2 h-4 w-1/3 animate-pulse bg-neutral-100" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-6 py-16 sm:px-8 lg:px-12">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200">
              <Heart size={26} strokeWidth={1.5} className="text-neutral-700" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Your Wishlist is empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Save the pieces you love and come back to them whenever you are
              ready.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-black px-7 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Explore Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-[1440px] px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => {
            const image = product.images?.[0];

            const hasComparePrice =
              typeof product.comparePrice === "number" &&
              product.comparePrice > product.price;

            return (
              <article key={product.id} className="group min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  {image ? (
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                      Image unavailable
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm transition hover:bg-neutral-50"
                  >
                    <Trash2 size={17} strokeWidth={1.7} />
                  </button>
                </div>

                <div className="pt-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                    {product.brand}
                  </p>

                  <Link href={`/products/${product.slug}`}>
                    <h2 className="mt-1 line-clamp-2 text-sm font-medium text-neutral-900 sm:text-base">
                      {product.name}
                    </h2>
                  </Link>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900 sm:text-base">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {hasComparePrice && product.comparePrice !== undefined && (
                      <span className="text-sm text-neutral-400 line-through">
                        ₹{product.comparePrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToBag(product)}
                    disabled={product.stock <= 0}
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
                  >
                    <ShoppingBag size={17} strokeWidth={1.8} />

                    {product.stock > 0 ? "Add to Bag" : "Out of Stock"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
