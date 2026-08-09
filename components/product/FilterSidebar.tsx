"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  brands: FilterOption[];
  categories: FilterOption[];
}

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
  const activeSort = searchParams.get("sort");

  return (
    <aside className="w-full lg:w-[220px] lg:shrink-0">
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Category</h2>

          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  updateFilter(
                    "category",
                    activeCategory === category.slug
                      ? undefined
                      : category.slug,
                  )
                }
                className={`block text-left text-sm transition ${
                  activeCategory === category.slug
                    ? "font-semibold text-black"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-8">
          <h2 className="text-sm font-semibold text-neutral-900">Brand</h2>

          <div className="mt-4 space-y-3">
            {brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() =>
                  updateFilter(
                    "brand",
                    activeBrand === brand.slug ? undefined : brand.slug,
                  )
                }
                className={`block text-left text-sm transition ${
                  activeBrand === brand.slug
                    ? "font-semibold text-black"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-8">
          <h2 className="text-sm font-semibold text-neutral-900">Price</h2>

          <div className="mt-4 space-y-3">
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
                  ? "font-semibold text-black"
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
                  ? "font-semibold text-black"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              High to Low
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
