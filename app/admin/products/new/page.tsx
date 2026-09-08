"use client";

import Link from "next/link";
import { useState } from "react";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export default function NewProductPage() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  function toggleSize(size: string) {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size],
    );
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

        <div className="space-y-6">
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
                  placeholder="e.g. Essential Oversized Tee"
                  className={inputClass}
                />
              </Field>

              <Field label="SKU">
                <input
                  type="text"
                  placeholder="e.g. BHF-TS-004"
                  className={inputClass}
                />
              </Field>

              <Field label="Slug">
                <input
                  type="text"
                  placeholder="essential-oversized-tee"
                  className={inputClass}
                />
              </Field>

              <Field label="Collection">
                <input
                  type="text"
                  placeholder="Essentials"
                  className={inputClass}
                />
              </Field>

              <Field label="Category">
                <select className={inputClass} defaultValue="">
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="t-shirts">T-Shirts</option>
                  <option value="shirts">Shirts</option>
                  <option value="jeans">Jeans</option>
                  <option value="hoodies">Hoodies</option>
                </select>
              </Field>

              <Field label="Brand">
                <select className={inputClass} defaultValue="">
                  <option value="" disabled>
                    Select brand
                  </option>
                  <option value="black-head-fashion">BlackHeadFashion</option>
                </select>
              </Field>

              <Field label="Gender">
                <select className={inputClass} defaultValue="MEN">
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </Field>

              <Field label="Description">
                <textarea
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
                  placeholder="1999"
                  className={inputClass}
                />
              </Field>

              <Field label="Compare Price">
                <input
                  type="number"
                  min="0"
                  placeholder="2499"
                  className={inputClass}
                />
              </Field>

              <Field label="Total Stock">
                <input
                  type="number"
                  min="0"
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
                  placeholder="Cotton"
                  className={inputClass}
                />
              </Field>

              <Field label="Fit">
                <input
                  type="text"
                  placeholder="Regular Fit"
                  className={inputClass}
                />
              </Field>

              <Field label="Pattern">
                <input type="text" placeholder="Solid" className={inputClass} />
              </Field>

              <Field label="Care Instructions">
                <input
                  type="text"
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
              <Toggle label="Active" defaultChecked />
              <Toggle label="Featured" />
              <Toggle label="New Arrival" />
              <Toggle label="Trending" />
            </div>

            <div className="mt-4">
              <Toggle label="On Sale" />
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div>
              <h2 className="text-base font-semibold">Images</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Add product image URLs. Image upload/storage will be connected
                next.
              </p>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-neutral-800">
                Primary Image URL
              </label>

              <input
                type="text"
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
              type="button"
              className="flex h-12 items-center justify-center rounded-full bg-black px-7 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black";

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
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      type="button"
      onClick={() => setChecked((current) => !current)}
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
