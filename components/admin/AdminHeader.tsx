"use client";

import { usePathname } from "next/navigation";

const pageMeta = {
  "/admin": {
    title: "Dashboard",
    description: "Business overview and performance",
  },
  "/admin/products": {
    title: "Products",
    description: "Manage your store products",
  },
  "/admin/orders": {
    title: "Orders",
    description: "Manage and track customer orders",
  },
  "/admin/customers": {
    title: "Customers",
    description: "View and manage your customers",
  },
  "/admin/analytics": {
    title: "Analytics",
    description: "Store performance and insights",
  },
  "/admin/settings": {
    title: "Settings",
    description: "Manage your store settings",
  },
} as const;

export default function AdminHeader() {
  const pathname = usePathname();

  const current =
    pageMeta[pathname as keyof typeof pageMeta] ??
    (pathname.startsWith("/admin/products/")
      ? {
          title: "Edit Product",
          description: "Update product information",
        }
      : pathname.startsWith("/admin/orders/")
        ? {
            title: "Order Details",
            description: "View and manage this customer order",
          }
        : pageMeta["/admin"]);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="flex min-h-[76px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {current.title}
          </h1>

          <p className="mt-1 text-sm text-neutral-500">{current.description}</p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">Prajwal Sonekar</p>
          <p className="text-xs text-neutral-500">Administrator</p>
        </div>
      </div>
    </header>
  );
}
