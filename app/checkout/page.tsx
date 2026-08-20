"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart/cart-context";
import { formatCurrency } from "@/lib/format";
import EmailLoginModal from "@/components/auth/EmailLoginModal";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  function handleEmailContinue(email: string) {
    console.log("checkout email:", email);
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200">
            <ShoppingBag
              size={26}
              strokeWidth={1.5}
              className="text-neutral-700"
            />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Your bag is empty
          </h1>

          <p className="mt-3 text-neutral-500">
            Add something to your bag before checkout.
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
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-neutral-500">
          Review your order before continuing.
        </p>
      </div>

      {/* Main Checkout */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Contact */}
        <section className="max-w-2xl">
          <h2 className="text-xl font-semibold tracking-tight">Contact</h2>

          <p className="mt-2 text-sm text-neutral-500">
            We’ll use your contact details for order updates.
          </p>
        </section>

        {/* Order Summary */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="mt-6 space-y-6">
            {items.map((item) => {
              const product = item.product;
              const image =
                product.images?.[0] ?? "/images/products/placeholder.jpg";

              return (
                <div key={`${product.id}-${item.size}`} className="flex gap-4">
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative h-28 w-24 shrink-0 overflow-hidden bg-white"
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-semibold hover:underline"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-2 text-sm text-neutral-500">
                      Size: {item.size}
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium">
                    {formatCurrency(product.price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Price Details */}
          <div className="mt-7 border-t border-neutral-200 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>

              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <span className="text-neutral-500">Delivery</span>

              <span className="font-medium">Free</span>
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-6">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>

                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={() => setIsLoginOpen(true)}
            className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Continue to Checkout
          </button>
        </aside>
      </div>

      {/* Email Login */}
      <EmailLoginModal
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onContinue={handleEmailContinue}
      />
    </main>
  );
}
