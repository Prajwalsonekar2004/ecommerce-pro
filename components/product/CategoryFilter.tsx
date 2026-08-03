"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function CategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changeCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get("category") === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Category</h3>

      <div className="space-y-3">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              type="checkbox"
              checked={searchParams.get("category") === category.slug}
              onChange={() => changeCategory(category.slug)}
            />

            <span>{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
