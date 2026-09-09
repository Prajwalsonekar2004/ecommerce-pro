"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ProductResponse = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    material: string | null;
    fit: string | null;
    pattern: string | null;
    careInstructions: string | null;
    sku: string;
    gender: "MEN" | "WOMEN" | "KIDS";
    thumbnail: string | null;
    price: string;
    comparePrice: string | null;
    collection: string | null;
    stock: number;
    isFeatured: boolean;
    isNewArrival: boolean;
    isTrending: boolean;
    isOnSale: boolean;
    isActive: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    brand: {
      id: string;
      name: string;
      slug: string;
    };
    images: Array<{
      id: string;
      url: string;
      alt: string | null;
      isPrimary: boolean;
      displayOrder: number;
    }>;
    sizes: Array<{
      id: string;
      size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
      quantity: number;
    }>;
  };
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductResponse["product"] | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as
          | ProductResponse
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "Unable to load product.",
          );
        }

        if (!("product" in data)) {
          throw new Error("Invalid product response.");
        }

        setProduct(data.product);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load product.",
        );
      }
    }

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="text-sm font-medium text-neutral-500 hover:text-black"
          >
            ← Back to Products
          </button>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm text-neutral-500">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          ← Back to Products
        </button>

        <div className="mt-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-neutral-500">{product.name}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Product
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {product.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                SKU
              </p>
              <p className="mt-1 text-sm text-neutral-700">{product.sku}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Category
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                {product.category.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Brand
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                {product.brand.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Price
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Stock
              </p>
              <p className="mt-1 text-sm text-neutral-700">{product.stock}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
