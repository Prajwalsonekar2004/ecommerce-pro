"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changePrice(min: number, max: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("minPrice", String(min));
    params.set("maxPrice", String(max));

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Price</h3>

      <div className="space-y-2">
        <button
          onClick={() => changePrice(0, 1000)}
          className="block w-full rounded-xl border border-neutral-200 p-3 text-left text-sm text-neutral-700 transition hover:border-black hover:bg-neutral-50"
        >
          ₹1000 - ₹2500
        </button>

        <button
          onClick={() => changePrice(2500, 5000)}
          className="block w-full rounded-lg border p-2 text-left hover:bg-gray-50"
        ></button>
      </div>
    </div>
  );
}
