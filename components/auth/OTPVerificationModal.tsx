"use client";

import { authClient } from "@/lib/auth-client";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface OTPVerificationModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onBack: () => void;
  onVerified: () => void;
}

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 300;

export default function OTPVerificationModal({
  open,
  email,
  onClose,
  onBack,
  onVerified,
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setIsLoading(false);
    setIsResending(false);
    setSecondsLeft(OTP_EXPIRY_SECONDS);

    requestAnimationFrame(() => {
      inputRefs.current[0]?.focus();
    });
  }, [open, email]);

  useEffect(() => {
    if (!open || secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [open, secondsLeft]);

  if (!open) {
    return null;
  }

  const otpValue = otp.join("");
  const isComplete = otpValue.length === OTP_LENGTH;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    setError("");

    setOtp((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) {
      return;
    }

    const next = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });

    setOtp(next);
    setError("");

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);

    inputRefs.current[focusIndex]?.focus();
  }

  async function handleResendOTP() {
    if (isResending || secondsLeft > 0) {
      return;
    }

    setError("");
    setIsResending(true);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        setError(error.message || "Unable to resend the verification code.");
        return;
      }

      setOtp(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(OTP_EXPIRY_SECONDS);

      requestAnimationFrame(() => {
        inputRefs.current[0]?.focus();
      });
    } catch (error) {
      console.error("OTP resend failed:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isComplete || isLoading || secondsLeft <= 0) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp: otpValue,
      });

      if (error) {
        setError(error.message || "Invalid OTP. Please try again.");
        return;
      }

      onVerified();
    } catch (error) {
      console.error("OTP verification failed:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-[24px] bg-white px-6 py-8 shadow-2xl sm:px-12 sm:py-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-500 transition hover:text-black"
        >
          <X size={18} />
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mt-8 text-center">
          <div className="text-2xl font-black tracking-tight">
            BlackHeadFashion
          </div>

          <h2 className="mt-8 text-2xl font-medium tracking-tight">
            Verify your email
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            We sent a 6-digit verification code to
          </p>

          <p className="mt-1 break-all text-sm font-medium text-black">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                aria-label={`OTP digit ${index + 1}`}
                className="h-12 w-10 rounded-xl border border-neutral-300 text-center text-lg font-semibold outline-none transition focus:border-black sm:h-14 sm:w-12"
              />
            ))}
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={
              !isComplete || isLoading || isResending || secondsLeft <= 0
            }
            className="mt-7 h-12 w-full rounded-full bg-black text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          {secondsLeft > 0 ? (
            <p>
              Code expires in{" "}
              <span className="font-medium text-black">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-red-600">This code has expired.</p>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="font-semibold text-black underline underline-offset-4 transition hover:text-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "Sending new code..." : "Resend code"}
              </button>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-neutral-500">
          Didn't receive the code? Check your spam or promotions folder.
        </p>
      </div>
    </div>
  );
}
