import { products } from "@/constants/data/products";
import Link from "next/link";

export default function HeroButtons() {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Link
        href="/products"
        className="rounded-full bg-black px-6 py-3 text-white transition hover:bg-gray-800"
      >
        Shop Now
      </Link>

      <Link
        href="/categories"
        className="rounded-full border border-black px-6 py-3 transition hover:bg-black hover:text-white"
      >
        Explore Collection
      </Link>
    </div>
  );
}
