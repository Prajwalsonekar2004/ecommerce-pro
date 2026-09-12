"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  CircleUserRound,
  LayoutDashboard,
  Settings,
  ShoppingCart,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Box,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: CircleUserRound,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-48 shrink-0 border-r border-neutral-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-neutral-200 px-4 py-5">
          <div className="text-base font-bold tracking-tight text-neutral-900">
            BlackHeadFashion
          </div>

          <div className="mt-1 text-xs text-neutral-500">Admin Panel</div>
        </div>

        <nav className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-black text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} />

                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-neutral-200 px-4 py-4">
          <p className="text-[11px] text-neutral-400">BlackHeadFashion Admin</p>
        </div>
      </div>
    </aside>
  );
}
