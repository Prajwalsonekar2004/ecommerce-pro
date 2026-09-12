import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/profile");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/profile");
  }

  if (user.role !== "USER") {
    redirect("/admin");
  }

  return (
    <main className="min-h-[70vh] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="border-b border-neutral-200 pb-8">
          <p className="text-sm text-neutral-500">My Account</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {user.name || "Welcome back"}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">{user.email}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/orders"
            className="rounded-2xl border border-neutral-200 p-6 transition hover:border-black"
          >
            <h2 className="text-lg font-semibold">My Orders</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Track and manage your orders.
            </p>
          </Link>

          <Link
            href="/profile"
            className="rounded-2xl border border-neutral-200 p-6 transition hover:border-black"
          >
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Manage your personal details.
            </p>
          </Link>

          <Link
            href="/wishlist"
            className="rounded-2xl border border-neutral-200 p-6 transition hover:border-black"
          >
            <h2 className="text-lg font-semibold">Wishlist</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              View your saved products.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
