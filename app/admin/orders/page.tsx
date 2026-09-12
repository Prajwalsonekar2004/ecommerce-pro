import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    payment?: string;
  }>;
};

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (admin?.role !== "ADMIN") {
    redirect("/");
  }

  const { search, status, payment } = await searchParams;

  const normalizedSearch = search?.trim() ?? "";

  const normalizedStatus = ORDER_STATUSES.includes(
    status as (typeof ORDER_STATUSES)[number],
  )
    ? (status as (typeof ORDER_STATUSES)[number])
    : "";

  const normalizedPayment = PAYMENT_STATUSES.includes(
    payment as (typeof PAYMENT_STATUSES)[number],
  )
    ? (payment as (typeof PAYMENT_STATUSES)[number])
    : "";

  const where: Prisma.OrderWhereInput = {
    ...(normalizedSearch
      ? {
          OR: [
            {
              orderNumber: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              shippingFullName: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),

    ...(normalizedStatus
      ? {
          status: normalizedStatus,
        }
      : {}),

    ...(normalizedPayment
      ? {
          paymentStatus: normalizedPayment,
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      totalAmount: true,
      currency: true,
      createdAt: true,
      shippingFullName: true,
      shippingCity: true,
      shippingState: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              Manage and track customer orders
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              {orders.length.toLocaleString("en-IN")}{" "}
              {orders.length === 1 ? "order" : "orders"}
            </h2>
          </div>

          <div className="text-sm text-neutral-500">
            Showing latest 100 orders
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
          <form
            method="get"
            className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]"
          >
            <label className="sr-only" htmlFor="order-search">
              Search orders
            </label>

            <input
              id="order-search"
              name="search"
              type="search"
              defaultValue={normalizedSearch}
              placeholder="Search order number or customer..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black"
            />

            <select
              name="status"
              defaultValue={normalizedStatus}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-black"
            >
              <option value="">All Order Status</option>

              {ORDER_STATUSES.map((orderStatus) => (
                <option key={orderStatus} value={orderStatus}>
                  {orderStatus}
                </option>
              ))}
            </select>

            <select
              name="payment"
              defaultValue={normalizedPayment}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-black"
            >
              <option value="">All Payment Status</option>

              {PAYMENT_STATUSES.map((paymentStatus) => (
                <option key={paymentStatus} value={paymentStatus}>
                  {paymentStatus}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Filter
            </button>
          </form>

          {(normalizedSearch || normalizedStatus || normalizedPayment) && (
            <Link
              href="/admin/orders"
              className="mt-3 inline-block text-sm font-medium text-neutral-500 transition hover:text-black"
            >
              Clear filters
            </Link>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-semibold text-neutral-900">
                No orders found
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Order
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Items
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Order Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-neutral-100 last:border-b-0"
                    >
                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold text-neutral-900">
                          #{order.orderNumber}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {order.createdAt.toLocaleDateString("en-IN")}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-medium text-neutral-900">
                          {order.shippingFullName}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {order.user.email}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          {order.shippingCity}, {order.shippingState}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm text-neutral-700">
                        {order._count.items}
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold text-neutral-900">
                          ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                        </p>

                        <p className="mt-1 text-xs uppercase text-neutral-400">
                          {order.currency}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-5 py-5">
                        <PaymentBadge status={order.paymentStatus} />
                      </td>

                      <td className="px-5 py-5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-800 transition hover:border-black hover:bg-black hover:text-white"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: (typeof ORDER_STATUSES)[number] }) {
  const className =
    status === "CANCELLED"
      ? "bg-red-50 text-red-600"
      : status === "DELIVERED"
        ? "bg-green-50 text-green-700"
        : status === "SHIPPED"
          ? "bg-blue-50 text-blue-700"
          : "bg-neutral-100 text-neutral-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({
  status,
}: {
  status: (typeof PAYMENT_STATUSES)[number];
}) {
  const className =
    status === "PAID"
      ? "bg-green-50 text-green-700"
      : status === "FAILED"
        ? "bg-red-50 text-red-600"
        : status === "REFUNDED"
          ? "bg-amber-50 text-amber-700"
          : "bg-neutral-100 text-neutral-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  );
}
