"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/lib/cart/cart-context";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-6 py-20">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200">
            <ShoppingBag
              size={26}
              strokeWidth={1.5}
              className="text-neutral-700"
            />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your bag is empty
          </h1>

          <p className="mt-3 text-neutral-500">
            Discover something you will love.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Shopping Bag
        </h1>

        <p className="mt-2 text-neutral-500">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {items.map((item) => {
            const product = item.product;
            const price = product.comparePrice ?? product.price;
            const image =
              product.images?.[0] ?? "/images/products/placeholder.jpg";

            return (
              <div
                key={`${product.id}-${item.size}`}
                className="flex gap-5 border-b border-neutral-200 pb-8"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden bg-neutral-100 sm:w-36"
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        {product.brand}
                      </p>

                      <Link
                        href={`/products/${product.slug}`}
                        className="mt-2 block text-lg font-semibold hover:underline"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 text-sm text-neutral-500">
                        {product.category}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        Size: {item.size}
                      </p>
                    </div>

                    <p className="font-semibold">
                      {formatCurrency(price * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6">
                    <div className="flex items-center rounded-full border border-neutral-300">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product.id,
                            item.size,
                            item.quantity - 1,
                          )
                        }
                        className="p-3 transition hover:bg-neutral-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product.id,
                            item.size,
                            item.quantity + 1,
                          )
                        }
                        className="p-3 transition hover:bg-neutral-100"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id, item.size)}
                      className="flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl bg-neutral-50 p-6 sm:p-8 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold">Summary</h2>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>

              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Delivery</span>

              <span className="font-medium">Free</span>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>

                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-8 flex h-14 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Checkout
          </Link>

          <Link
            href="/products"
            className="mt-4 flex h-12 items-center justify-center rounded-full border border-neutral-300 text-sm font-semibold transition hover:bg-white"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
