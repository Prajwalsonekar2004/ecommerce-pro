"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import EmailLoginModal from "@/components/auth/EmailLoginModal";
import OTPVerificationModal from "@/components/auth/OTPVerificationModal";

export default function ProfilePage() {
  const router = useRouter();

  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [email, setEmail] = useState("");

  function handleEmailContinue(value: string) {
    setEmail(value);
    setIsLoginOpen(false);
    setIsOTPOpen(true);
  }

  function handleVerified() {
    setIsOTPOpen(false);
    router.push("/");
  }

  return (
    <>
      <EmailLoginModal
        open={isLoginOpen}
        onClose={() => router.push("/")}
        onContinue={handleEmailContinue}
      />

      <OTPVerificationModal
        open={isOTPOpen}
        email={email}
        onClose={() => router.push("/")}
        onBack={() => {
          setIsOTPOpen(false);
          setIsLoginOpen(true);
        }}
        onVerified={handleVerified}
      />
    </>
  );
}
