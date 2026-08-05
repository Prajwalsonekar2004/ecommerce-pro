"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function handleSearch() {
    const params = new URLSearchParams(searchParams);

    if (search.trim()) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Search products..."
        className="h-14 w-full rounded-full border border-neutral-300 bg-white px-14 text-base shadow-sm focus:border-black focus:ring-0"
      />

      <button
        onClick={handleSearch}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Search
      </button>
    </div>
  );
}
