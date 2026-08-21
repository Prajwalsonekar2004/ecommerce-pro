"use client";

import Script from "next/script";
import { useState } from "react";

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  email: string;
  contact: string;
  onSuccess: (response: RazorpayPaymentResponse) => void;
  onClose: () => void;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: string,
    handler: (response: {
      error?: {
        description?: string;
        reason?: string;
      };
    }) => void,
  ) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    order_id: string;
  };
  theme: {
    color: string;
  };
  modal: {
    confirm_close: boolean;
    escape: boolean;
    backdropclose: boolean;
    animation: boolean;
    ondismiss: () => void;
  };
  handler: (response: RazorpayPaymentResponse) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function RazorpayCheckout({
  orderId,
  amount,
  currency,
  name,
  email,
  contact,
  onSuccess,
  onClose,
}: RazorpayCheckoutProps) {
  const [isOpening, setIsOpening] = useState(false);

  function openCheckout() {
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error("NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured.");
      return;
    }

    if (!window.Razorpay) {
      console.error("Razorpay Checkout has not loaded yet.");
      return;
    }

    setIsOpening(true);

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "BlackHeadFashion",
      description: "BlackHeadFashion Order",
      order_id: orderId,

      prefill: {
        name,
        email,
        contact,
      },

      notes: {
        order_id: orderId,
      },

      theme: {
        color: "#000000",
      },

      modal: {
        confirm_close: true,
        escape: true,
        backdropclose: false,
        animation: true,
        ondismiss: () => {
          setIsOpening(false);
          onClose();
        },
      },

      handler: (response) => {
        setIsOpening(false);
        onSuccess(response);
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      console.error("Razorpay payment failed:", response.error);

      setIsOpening(false);
      onClose();
    });

    razorpay.open();
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Razorpay Checkout loaded.");
        }}
        onError={() => {
          console.error("Failed to load Razorpay Checkout.");
        }}
      />

      <button
        type="button"
        onClick={openCheckout}
        disabled={isOpening}
        className="flex h-14 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {isOpening ? "Opening Payment..." : "Pay Now"}
      </button>
    </>
  );
}
