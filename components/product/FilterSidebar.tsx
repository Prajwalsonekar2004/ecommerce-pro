"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  brands: FilterOption[];
  categories: FilterOption[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function FilterSidebar({ brands, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category");
  const activeBrand = searchParams.get("brand");
  const activeSize = searchParams.get("size");
  const activeSort = searchParams.get("sort");

  return (
    <aside className="w-full lg:w-[220px] lg:shrink-0">
      <div className="space-y-5">
        <details open className="border-b border-neutral-200 pb-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-900 [&::-webkit-details-marker]:hidden">
            Category
            <ChevronDown size={17} strokeWidth={1.7} />
          </summary>

          <div className="mt-5 space-y-3">
            {categories.map((category) => {
              const active = activeCategory === category.slug;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    updateFilter("category", active ? undefined : category.slug)
                  }
                  className={`block text-left text-sm transition ${
                    active
                      ? "font-medium text-black"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </details>

        <details open className="border-b border-neutral-200 pb-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-900 [&::-webkit-details-marker]:hidden">
            Size
            <ChevronDown size={17} strokeWidth={1.7} />
          </summary>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {sizes.map((size) => {
              const active = activeSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    updateFilter("size", active ? undefined : size)
                  }
                  className={`h-9 rounded-md border text-xs font-medium transition ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </details>

        <details open className="border-b border-neutral-200 pb-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-900 [&::-webkit-details-marker]:hidden">
            Brand
            <ChevronDown size={17} strokeWidth={1.7} />
          </summary>

          <div className="mt-5 space-y-3">
            {brands.map((brand) => {
              const active = activeBrand === brand.slug;

              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() =>
                    updateFilter("brand", active ? undefined : brand.slug)
                  }
                  className={`block text-left text-sm transition ${
                    active
                      ? "font-medium text-black"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  {brand.name}
                </button>
              );
            })}
          </div>
        </details>

        <details open>
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-900 [&::-webkit-details-marker]:hidden">
            Price
            <ChevronDown size={17} strokeWidth={1.7} />
          </summary>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() =>
                updateFilter(
                  "sort",
                  activeSort === "price-low" ? undefined : "price-low",
                )
              }
              className={`block text-left text-sm transition ${
                activeSort === "price-low"
                  ? "font-medium text-black"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Low to High
            </button>

            <button
              type="button"
              onClick={() =>
                updateFilter(
                  "sort",
                  activeSort === "price-high" ? undefined : "price-high",
                )
              }
              className={`block text-left text-sm transition ${
                activeSort === "price-high"
                  ? "font-medium text-black"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              High to Low
            </button>
          </div>
        </details>
      </div>
    </aside>
  );
}
