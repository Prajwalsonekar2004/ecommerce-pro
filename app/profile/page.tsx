"use client";

import { ShieldCheck, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import EmailLoginModal from "@/components/auth/EmailLoginModal";
import OTPVerificationModal from "@/components/auth/OTPVerificationModal";

type LoginRole = "USER" | "ADMIN";

export default function ProfilePage() {
  const router = useRouter();

  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState<LoginRole | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [email, setEmail] = useState("");

  function handleRoleSelect(role: LoginRole) {
    setSelectedRole(role);
    setIsRoleSelectorOpen(false);
    setIsLoginOpen(true);
  }

  function handleEmailContinue(value: string) {
    setEmail(value);
    setIsLoginOpen(false);
    setIsOTPOpen(true);
  }

  function handleVerified() {
    setIsOTPOpen(false);

    if (selectedRole === "ADMIN") {
      router.push("/admin");
      return;
    }

    router.push("/account");
  }

  function handleClose() {
    router.push("/");
  }

  return (
    <>
      {isRoleSelectorOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-role-title"
            className="relative w-full max-w-[420px] rounded-[24px] bg-white px-7 py-8 shadow-2xl sm:px-9 sm:py-9"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
            >
              <X size={18} strokeWidth={1.8} />
            </button>

            <div className="text-center">
              <div className="text-2xl font-black tracking-tight text-black">
                BlackHeadFashion
              </div>

              <h1
                id="profile-role-title"
                className="mt-7 text-2xl font-medium tracking-tight"
              >
                Continue as
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                Choose how you want to access your account.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => handleRoleSelect("USER")}
                className="flex w-full items-center gap-4 rounded-2xl border border-neutral-200 px-5 py-4 text-left transition hover:border-black hover:bg-neutral-50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <UserRound size={21} strokeWidth={1.8} />
                </span>

                <span>
                  <span className="block text-sm font-semibold text-black">
                    User
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    Shop products, manage your account and orders.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("ADMIN")}
                className="flex w-full items-center gap-4 rounded-2xl border border-neutral-200 px-5 py-4 text-left transition hover:border-black hover:bg-neutral-50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <ShieldCheck size={21} strokeWidth={1.8} />
                </span>

                <span>
                  <span className="block text-sm font-semibold text-black">
                    Admin
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    Manage products, orders and store operations.
                  </span>
                </span>
              </button>
            </div>

            <p className="mt-7 text-center text-xs leading-5 text-neutral-500">
              You will verify your email with a one-time password.
            </p>
          </div>
        </div>
      )}

      <EmailLoginModal
        open={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setIsRoleSelectorOpen(true);
        }}
        onContinue={handleEmailContinue}
      />

      <OTPVerificationModal
        open={isOTPOpen}
        email={email}
        onClose={() => {
          setIsOTPOpen(false);
          setIsRoleSelectorOpen(true);
        }}
        onBack={() => {
          setIsOTPOpen(false);
          setIsLoginOpen(true);
        }}
        onVerified={handleVerified}
      />
    </>
  );
}
