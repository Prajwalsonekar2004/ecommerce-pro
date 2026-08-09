"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "newest";

  function updateSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <select
        aria-label="Sort products"
        value={
          currentSort === "price-low" || currentSort === "price-high"
            ? "newest"
            : currentSort
        }
        onChange={(event) => updateSort(event.target.value)}
        className="h-11 min-w-[150px] rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 outline-none transition focus:border-black"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}
