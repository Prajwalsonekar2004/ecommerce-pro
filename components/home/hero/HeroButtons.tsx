import { heroContent } from "@/constants/data/hero";
import { products } from "@/constants/data/products";
import Link from "next/link";

export default function HeroButtons() {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Link
        href={heroContent.primaryButton.href}
        className="rounded-full bg-black px-6 py-3 text-white transition hover:bg-gray-800"
      >
        {heroContent.primaryButton.label}
      </Link>

      <Link
        href={heroContent.secondaryButton.href}
        className="rounded-full border border-black px-6 py-3 transition hover:bg-black hover:text-white"
      >
        {heroContent.secondaryButton.label}
      </Link>
    </div>
  );
}
