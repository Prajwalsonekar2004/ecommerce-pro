"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductFiltersProps = {
  categories: CategoryOption[];
};

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false },
    );
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("status");

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false },
    );
  }

  const hasFilters = Boolean(currentCategory || currentStatus !== "all");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <select
        value={currentCategory}
        onChange={(event) => updateFilter("category", event.target.value)}
        className="rounded-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-black"
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={currentStatus}
        onChange={(event) => updateFilter("status", event.target.value)}
        className="rounded-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-black"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {hasFilters ? (
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-full px-4 py-3 text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          Clear Filters
        </button>
      ) : null}
    </div>
  );
}
