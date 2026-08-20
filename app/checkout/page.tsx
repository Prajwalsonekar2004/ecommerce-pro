"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/lib/cart/cart-context";
import { formatCurrency } from "@/lib/format";

import EmailLoginModal from "@/components/auth/EmailLoginModal";
import OTPVerificationModal from "@/components/auth/OTPVerificationModal";
import AddressSection from "@/components/checkout/AddressSection";

interface CheckoutAddress {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  houseNo: string;
  addressLine: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [selectedAddress, setSelectedAddress] =
    useState<CheckoutAddress | null>(null);

  function handleEmailContinue(email: string) {
    setCheckoutEmail(email);
    setIsLoginOpen(false);
    setIsOTPOpen(true);
  }

  function handleOTPVerified() {
    setIsOTPOpen(false);
    setIsAuthenticated(true);
  }

  function handleAddressChange(address: CheckoutAddress | null) {
    setSelectedAddress(address);
  }

  function handleContinueToPayment() {
    if (!selectedAddress) {
      return;
    }

    console.log("Selected checkout address:", selectedAddress);
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
    <main className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-14">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          {isAuthenticated
            ? "Choose where you want your order delivered."
            : "Complete your details to continue."}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="min-w-0">
          {!isAuthenticated ? (
            <div className="max-w-2xl">
              <div className="rounded-2xl border border-neutral-200 p-6 sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight">
                  Contact
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-500">
                  Sign in with your email to continue. We’ll use your details
                  for order updates and faster checkout.
                </p>

                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="mt-8 flex h-14 w-full max-w-sm items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Continue with Email
                </button>
              </div>
            </div>
          ) : (
            <AddressSection onAddressChange={handleAddressChange} />
          )}
        </section>

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

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleContinueToPayment}
              disabled={!selectedAddress}
              className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
            >
              Continue to Payment
            </button>
          )}

          {isAuthenticated && !selectedAddress && (
            <p className="mt-3 text-center text-xs text-neutral-500">
              Select a delivery address to continue.
            </p>
          )}
        </aside>
      </div>

      <EmailLoginModal
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onContinue={handleEmailContinue}
      />

      <OTPVerificationModal
        open={isOTPOpen}
        email={checkoutEmail}
        onClose={() => setIsOTPOpen(false)}
        onBack={() => {
          setIsOTPOpen(false);
          setIsLoginOpen(true);
        }}
        onVerified={handleOTPVerified}
      />
    </main>
  );
}
