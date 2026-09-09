"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(currentSearch);

  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }

      router.replace(
        `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false },
      );
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, pathname, router, searchParams]);

  return (
    <div className="w-full sm:max-w-md">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>

      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products..."
        className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black"
      />
    </div>
  );
}
