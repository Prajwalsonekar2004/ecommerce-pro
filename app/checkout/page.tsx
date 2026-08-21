"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart/cart-context";
import { formatCurrency } from "@/lib/format";

import EmailLoginModal from "@/components/auth/EmailLoginModal";
import OTPVerificationModal from "@/components/auth/OTPVerificationModal";
import AddressSection from "@/components/checkout/AddressSection";
import RazorpayCheckout, {
  RazorpayPaymentResponse,
} from "@/components/checkout/RazorpayCheckout";
import ProfileDetailsModal from "@/components/auth/ProfileDetailsModal";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";

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

interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
}

const CHECKOUT_AUTH_KEY = "blackheadfashion-checkout-authenticated";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    sessionStorage.removeItem(CHECKOUT_AUTH_KEY);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("checkout-authenticated"));
  }, []);

  const [checkoutEmail, setCheckoutEmail] = useState("");

  const [selectedAddress, setSelectedAddress] =
    useState<CheckoutAddress | null>(null);

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [paymentError, setPaymentError] = useState("");

  const [razorpayOrder, setRazorpayOrder] = useState<RazorpayOrder | null>(
    null,
  );

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function handleEmailContinue(email: string) {
    setCheckoutEmail(email);
    setIsLoginOpen(false);
    setIsOTPOpen(true);
  }

  function handleOTPVerified() {
    setIsOTPOpen(false);
    setIsAuthenticated(true);

    sessionStorage.setItem(CHECKOUT_AUTH_KEY, "true");

    window.dispatchEvent(new Event("checkout-authenticated"));

    setIsProfileOpen(true);
  }

  function handleProfileCompleted() {
    setIsProfileOpen(false);
  }

  function handleAddressChange(address: CheckoutAddress | null) {
    setSelectedAddress(address);
    setPaymentError("");
    setRazorpayOrder(null);
  }

  async function handleContinueToPayment() {
    if (!selectedAddress || isCreatingOrder) {
      return;
    }

    if (items.length === 0) {
      setPaymentError("Your bag is empty.");
      return;
    }

    setPaymentError("");
    setIsCreatingOrder(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddress.id,
          items: items.map((item) => ({
            productId: item.product.id,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create your order.");
      }

      if (
        !data.razorpay?.orderId ||
        !data.razorpay?.amount ||
        !data.razorpay?.currency
      ) {
        throw new Error("Invalid payment order received.");
      }

      setRazorpayOrder({
        orderId: data.razorpay.orderId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
      });
    } catch (error) {
      console.error("Failed to create order:", error);

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Unable to start payment. Please try again.",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  }

  async function handlePaymentSuccess(response: RazorpayPaymentResponse) {
    setPaymentError("");

    try {
      const verifyResponse = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        }),
      });

      const data = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(data.error || "Payment verification failed.");
      }

      console.log("Payment verified:", data);

      setRazorpayOrder(null);
      setPaymentError("");
    } catch (error) {
      console.error("Payment verification failed:", error);

      setPaymentError(
        error instanceof Error ? error.message : "Payment verification failed.",
      );
    }
  }

  function handlePaymentClosed() {
    setRazorpayOrder(null);
    setPaymentError("");
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
    <>
      {isAuthenticated && (
        <CheckoutHeader currentStep={selectedAddress ? "payment" : "address"} />
      )}

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
                  <div
                    key={`${product.id}-${item.size}`}
                    className="flex gap-4"
                  >
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

            {isAuthenticated && !razorpayOrder && (
              <button
                type="button"
                onClick={handleContinueToPayment}
                disabled={!selectedAddress || isCreatingOrder}
                className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
              >
                {isCreatingOrder
                  ? "Preparing Payment..."
                  : "Continue to Payment"}
              </button>
            )}

            {isAuthenticated && razorpayOrder && (
              <div className="mt-7">
                <RazorpayCheckout
                  orderId={razorpayOrder.orderId}
                  amount={razorpayOrder.amount}
                  currency={razorpayOrder.currency}
                  name={selectedAddress?.fullName ?? ""}
                  email={checkoutEmail}
                  contact={selectedAddress?.phone ?? ""}
                  onSuccess={handlePaymentSuccess}
                  onClose={handlePaymentClosed}
                />
              </div>
            )}

            {isAuthenticated && !selectedAddress && !razorpayOrder && (
              <p className="mt-3 text-center text-xs text-neutral-500">
                Select a delivery address to continue.
              </p>
            )}

            {paymentError && (
              <p className="mt-4 text-center text-sm leading-5 text-red-600">
                {paymentError}
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

        <ProfileDetailsModal
          open={isProfileOpen}
          email={checkoutEmail}
          onCompleted={handleProfileCompleted}
        />
      </main>
    </>
  );
}
