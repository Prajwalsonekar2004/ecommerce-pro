"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Products
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Discover premium fashion curated for everyday style.
        </p>
      </div>

      {/* Right */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}

        <div className="relative w-full sm:w-[360px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search premium products..."
            className="
              h-12
              w-full
              rounded-full
              border
              border-neutral-300
              bg-white
              pl-11
              pr-5
              text-sm
              shadow-sm
              outline-none
              transition-all
              duration-300
              focus:border-black
              focus:ring-4
              focus:ring-neutral-100
            "
          />
        </div>

        {/* Sort */}

        <select
          defaultValue={searchParams.get("sort") ?? "newest"}
          onChange={(e) => handleSort(e.target.value)}
          className="
            h-12
            rounded-full
            border
            border-neutral-300
            bg-white
            px-5
            text-sm
            shadow-sm
            outline-none
            transition-all
            duration-300
            focus:border-black
            focus:ring-4
            focus:ring-neutral-100
          "
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-low">Price : Low to High</option>
          <option value="price-high">Price : High to Low</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
