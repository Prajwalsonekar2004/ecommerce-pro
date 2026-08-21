import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import SiteChrome from "@/components/layout/SiteChrome";

import { CartProvider } from "@/lib/cart/cart-context";
import { WishlistProvider } from "@/lib/wishlist/wishlist-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlackHeadFashion",
  description:
    "Premium fashion crafted for confidence, comfort and everyday style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-neutral-900">
        <CartProvider>
          <WishlistProvider>
            <SiteChrome>
              <main className="min-h-screen">{children}</main>
            </SiteChrome>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
