"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Option {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  title: string;
  queryKey: string;
  options: Option[];
}

export default function FilterGroup({ title, queryKey, options }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changeValue(slug: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(queryKey) === slug) {
      params.delete(queryKey);
    } else {
      params.set(queryKey, slug);
    }

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              type="checkbox"
              checked={searchParams.get("queryKey") === option.slug}
              onChange={() => changeValue(option.slug)}
            />

            <span>{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
