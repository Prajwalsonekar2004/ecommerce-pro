"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

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
    <details open className="border-b border-neutral-200 pb-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-900 [&::-webkit-details-marker]:hidden">
        {title}

        <ChevronDown
          size={17}
          strokeWidth={1.7}
          className="transition-transform"
        />
      </summary>

      <div className="mt-5 space-y-3">
        {options.map((option) => {
          const checked = searchParams.get(queryKey) === option.slug;

          return (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => changeValue(option.slug)}
                className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-black"
              />

              <span
                className={
                  checked ? "font-medium text-black" : "text-neutral-600"
                }
              >
                {option.name}
              </span>
            </label>
          );
        })}
      </div>
    </details>
  );
}
