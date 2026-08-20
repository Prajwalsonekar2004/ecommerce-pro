"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface EmailLoginModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: (email: string) => void;
}

export default function EmailLoginModal({
  open,
  onClose,
  onContinue,
}: EmailLoginModalProps) {
  const [email, setEmail] = useState("");

  if (!open) {
    return null;
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handelSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail) {
      return;
    }

    onContinue(email);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-[24px] bg-white px-8 py-10 shadow-2xl sm:px-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-500 transition hover:text-black"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <div className="text-2xl font-black tracking-tight">
            BlackHeadFashion
          </div>

          <h2 className="mt-8 text-2xl font-medium tracking-tight">
            Log in to your account
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Get personalised picks & faster checkout
          </p>
        </div>

        <form onSubmit={handelSubmit} className="mt-7">
          <label htmlFor="checkout-email" className="sr-only">
            Email address
          </label>
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            className="h-14 w-full rounded-xl border border-neutral-400 px-4 text-sm outline-none transition focus:border-black"
          />

          <button
            type="submit"
            disabled={!isValidEmail}
            className="mt-7 h-12 w-full rounded-full bg-black text-sm font-semibold text-white transition hover:bg-neutral-800 
                    disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
          >
            Get OTP
          </button>
        </form>

        <p className="mt-7 text-center text-xs leading-5 text-neutral-500">
          By entering this site, you agree to the{" "}
          <span className="font-medium text-black underline">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="font-medium text-black underline">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}
