"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function BrandFilter({ brands }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changeBrand(slug: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get("brand") === slug) {
      params.delete("brand");
    } else {
      params.set("brand", slug);
    }

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Brand</h3>

      <div className="space-y-3">
        {brands.map((brand) => (
          <label
            key={brand.id}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              type="checkbox"
              checked={searchParams.get("brand") === brand.slug}
              onChange={() => changeBrand(brand.slug)}
            />
            {brand.name}
          </label>
        ))}
      </div>
    </div>
  );
}
