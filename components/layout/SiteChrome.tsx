"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CHECKOUT_AUTH_KEY = "blackheadfashion-checkout-authenticated";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isCheckoutFlow =
    pathname === "/checkout" || pathname.startsWith("/checkout/");

  const [checkoutAuthenticated, setCheckoutAuthenticated] = useState(false);

  useEffect(() => {
    if (!isCheckoutFlow) {
      return;
    }

    const authenticated = sessionStorage.getItem(CHECKOUT_AUTH_KEY) === "true";
    // Read checkout authentication state from sessionStorage on route entry.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCheckoutAuthenticated(authenticated);
  }, [isCheckoutFlow]);

  useEffect(() => {
    if (!isCheckoutFlow) {
      return;
    }

    function handleCheckoutAuthChange() {
      setCheckoutAuthenticated(
        sessionStorage.getItem(CHECKOUT_AUTH_KEY) === "true",
      );
    }

    window.addEventListener("checkout-authenticated", handleCheckoutAuthChange);

    return () => {
      window.removeEventListener(
        "checkout-authenticated",
        handleCheckoutAuthChange,
      );
    };
  }, [isCheckoutFlow]);

  const showMainChrome = !isCheckoutFlow || !checkoutAuthenticated;

  return (
    <>
      {showMainChrome && <Navbar />}

      {children}

      {!isCheckoutFlow && <Footer />}
    </>
  );
}
