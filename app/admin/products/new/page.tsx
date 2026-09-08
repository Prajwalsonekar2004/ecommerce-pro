"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type CatalogItem = {
  id: string;
  name: string;
  slug: string;
};

type CatalogResponse = {
  categories: CatalogItem[];
  brands: CatalogItem[];
};

type FormState = {
  name: string;
  sku: string;
  slug: string;
  collection: string;
  categoryId: string;
  brandId: string;
  gender: "MEN" | "WOMEN" | "KIDS";
  description: string;
  price: string;
  comparePrice: string;
  stock: string;
  material: string;
  fit: string;
  pattern: string;
  careInstructions: string;
  thumbnail: string;
};

const initialForm: FormState = {
  name: "",
  sku: "",
  slug: "",
  collection: "",
  categoryId: "",
  brandId: "",
  gender: "MEN",
  description: "",
  price: "",
  comparePrice: "",
  stock: "",
  material: "",
  fit: "",
  pattern: "",
  careInstructions: "",
  thumbnail: "",
};

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black";

export default function NewProductPage() {
  const [form, setForm] = useState<FormState>(initialForm);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [brands, setBrands] = useState<CatalogItem[]>([]);

  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);

  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      try {
        setIsLoadingCatalog(true);
        setError("");

        const response = await fetch("/api/admin/catalog", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as
          | CatalogResponse
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "Unable to load categories and brands.",
          );
        }

        if (!("categories" in data) || !("brands" in data)) {
          throw new Error("Invalid catalog response.");
        }

        setCategories(data.categories);
        setBrands(data.brands);
      } catch (catalogError) {
        setError(
          catalogError instanceof Error
            ? catalogError.message
            : "Unable to load catalog data.",
        );
      } finally {
        setIsLoadingCatalog(false);
      }
    }

    loadCatalog();
  }, []);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(value: string) {
    updateField("name", value);

    if (!form.slug) {
      updateField(
        "slug",
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      );
    }
  }

  function toggleSize(size: string) {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (isLoadingCatalog) {
      return;
    }

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.sku.trim()) {
      setError("SKU is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!form.brandId) {
      setError("Please select a brand.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    const comparePrice = form.comparePrice.trim()
      ? Number(form.comparePrice)
      : undefined;

    if (
      comparePrice !== undefined &&
      (!Number.isFinite(comparePrice) || comparePrice < 0)
    ) {
      setError("Please enter a valid compare price.");
      return;
    }

    try {
      setIsCreating(true);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),

          material: form.material.trim(),
          fit: form.fit.trim(),
          pattern: form.pattern.trim(),
          careInstructions: form.careInstructions.trim(),

          sku: form.sku.trim(),
          gender: form.gender,

          thumbnail: form.thumbnail.trim(),

          price,
          comparePrice,

          categoryId: form.categoryId,
          brandId: form.brandId,

          collection: form.collection.trim(),

          stock,

          featured: isFeatured,
          newArrival: isNewArrival,
          trending: isTrending,
          isOnSale,
          isActive,

          images: form.thumbnail.trim()
            ? [
                {
                  url: form.thumbnail.trim(),
                  alt: form.name.trim(),
                  isPrimary: true,
                },
              ]
            : [],

          colors: [],

          sizes: selectedSizes.map((size) => ({
            size,
            quantity: 0,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Unable to create product.",
        );
      }

      setSuccess("Product created successfully.");

      setForm(initialForm);
      setSelectedSizes([]);
      setIsActive(true);
      setIsFeatured(false);
      setIsNewArrival(false);
      setIsTrending(false);
      setIsOnSale(false);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create product.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ← Back to Products
          </Link>

          <div className="mt-5">
            <h1 className="text-2xl font-semibold tracking-tight">
              Add Product
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Create a new product for your store
            </p>
          </div>
        </div>

        {(error || success) && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-neutral-200 bg-white text-neutral-800"
            }`}
          >
            {error || success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div>
              <h2 className="text-base font-semibold">Basic Information</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Main product details shown across your store.
              </p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <Field label="Product Name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="e.g. Essential Oversized Tee"
                  className={inputClass}
                />
              </Field>

              <Field label="SKU">
                <input
                  type="text"
                  value={form.sku}
                  onChange={(event) => updateField("sku", event.target.value)}
                  placeholder="e.g. BHF-TS-004"
                  className={inputClass}
                />
              </Field>

              <Field label="Slug">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="essential-oversized-tee"
                  className={inputClass}
                />
              </Field>

              <Field label="Collection">
                <input
                  type="text"
                  value={form.collection}
                  onChange={(event) =>
                    updateField("collection", event.target.value)
                  }
                  placeholder="Essentials"
                  className={inputClass}
                />
              </Field>

              <Field label="Category">
                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    updateField("categoryId", event.target.value)
                  }
                  className={inputClass}
                  disabled={isLoadingCatalog}
                >
                  <option value="">
                    {isLoadingCatalog
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Brand">
                <select
                  value={form.brandId}
                  onChange={(event) =>
                    updateField("brandId", event.target.value)
                  }
                  className={inputClass}
                  disabled={isLoadingCatalog}
                >
                  <option value="">
                    {isLoadingCatalog ? "Loading brands..." : "Select brand"}
                  </option>

                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={(event) =>
                    updateField(
                      "gender",
                      event.target.value as FormState["gender"],
                    )
                  }
                  className={inputClass}
                >
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="KIDS">Kids</option>
                </select>
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe the product..."
                  rows={4}
                  className={`${inputClass} h-auto py-3`}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div>
              <h2 className="text-base font-semibold">Pricing & Inventory</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Set selling price and available inventory.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <Field label="Price">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  placeholder="1999"
                  className={inputClass}
                />
              </Field>

              <Field label="Compare Price">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.comparePrice}
                  onChange={(event) =>
                    updateField("comparePrice", event.target.value)
                  }
                  placeholder="2499"
                  className={inputClass}
                />
              </Field>

              <Field label="Total Stock">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                  placeholder="50"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div>
              <h2 className="text-base font-semibold">Product Details</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Add information customers can use to understand the product.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Material">
                <input
                  type="text"
                  value={form.material}
                  onChange={(event) =>
                    updateField("material", event.target.value)
                  }
                  placeholder="Cotton"
                  className={inputClass}
                />
              </Field>

              <Field label="Fit">
                <input
                  type="text"
                  value={form.fit}
                  onChange={(event) => updateField("fit", event.target.value)}
                  placeholder="Regular Fit"
                  className={inputClass}
                />
              </Field>

              <Field label="Pattern">
                <input
                  type="text"
                  value={form.pattern}
                  onChange={(event) =>
                    updateField("pattern", event.target.value)
                  }
                  placeholder="Solid"
                  className={inputClass}
                />
              </Field>

              <Field label="Care Instructions">
                <input
                  type="text"
                  value={form.careInstructions}
                  onChange={(event) =>
                    updateField("careInstructions", event.target.value)
                  }
                  placeholder="Machine wash cold"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-neutral-800">
                Available Sizes
              </p>

              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => {
                  const selected = selectedSizes.includes(size);

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`flex h-11 min-w-12 items-center justify-center rounded-xl border px-4 text-sm font-medium transition ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div>
              <h2 className="text-base font-semibold">Store Visibility</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Control how this product appears across the store.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Toggle
                label="Active"
                checked={isActive}
                onChange={setIsActive}
              />
              <Toggle
                label="Featured"
                checked={isFeatured}
                onChange={setIsFeatured}
              />
              <Toggle
                label="New Arrival"
                checked={isNewArrival}
                onChange={setIsNewArrival}
              />
              <Toggle
                label="Trending"
                checked={isTrending}
                onChange={setIsTrending}
              />
            </div>

            <div className="mt-4 max-w-sm">
              <Toggle
                label="On Sale"
                checked={isOnSale}
                onChange={setIsOnSale}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div>
              <h2 className="text-base font-semibold">Images</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Add the primary product image URL.
              </p>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-neutral-800">
                Primary Image URL
              </label>

              <input
                type="text"
                value={form.thumbnail}
                onChange={(event) =>
                  updateField("thumbnail", event.target.value)
                }
                placeholder="/images/products/..."
                className={`${inputClass} mt-2`}
              />
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="flex h-12 items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-800 transition hover:border-black"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isCreating || isLoadingCatalog}
              className="flex h-12 items-center justify-center rounded-full bg-black px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {isCreating ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-left"
    >
      <span className="text-sm font-medium text-neutral-800">{label}</span>

      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-black" : "bg-neutral-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}
