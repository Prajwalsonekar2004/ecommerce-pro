import ProductActions from "@/components/admin/ProductActions";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          displayOrder: "asc",
        },
        take: 1,
      },
      category: {
        select: {
          name: true,
        },
      },
      brand: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Products</h1>

            <p className="mt-1 text-sm text-neutral-500">
              Manage your store products
            </p>
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:w-auto"
          >
            Add Product
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const rawImage = product.images[0]?.url ?? product.thumbnail;

                  const image =
                    typeof rawImage === "string" && rawImage.trim()
                      ? rawImage.trim().replace(/\\/g, "/").replace(/^\/?/, "/")
                      : null;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-100 last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                            {image ? (
                              <Image
                                src={image}
                                alt={product.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-neutral-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {product.sku}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {product.brand.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {product.category.name}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-900">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>

                          {product.comparePrice ? (
                            <span className="text-xs text-neutral-400 line-through">
                              ₹
                              {Number(product.comparePrice).toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm">
                        <span
                          className={
                            product.stock <= 0
                              ? "font-medium text-red-600"
                              : product.stock <= 5
                                ? "font-medium text-amber-600"
                                : "text-neutral-700"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            product.isActive
                              ? "inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                              : "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                          }
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-800 transition hover:border-black hover:bg-black hover:text-white"
                          >
                            Edit
                          </Link>

                          <ProductActions
                            productId={product.id}
                            isActive={product.isActive}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-medium text-neutral-900">
                No products found
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Add your first product to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
