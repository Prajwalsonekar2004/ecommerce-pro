import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import OrderStatusControl from "@/components/admin/OrderStatusControl";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type AdminOrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
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
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 sm:px-8 lg:px-10">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Order
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    #{order.orderNumber}
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    {order.createdAt.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <OrderBadge label="Order" value={order.status} />

                  <OrderBadge label="Payment" value={order.paymentStatus} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-200 px-5 py-5 sm:px-6">
                <h2 className="text-base font-semibold">Items</h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"} in this order
                </p>
              </div>

              <div className="divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Size: {item.size}
                        {item.color ? ` · Color: ${item.color}` : ""}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-neutral-900">
                        ₹{Number(item.totalPrice).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        ₹{Number(item.unitPrice).toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold">Shipping Address</h2>

              <div className="mt-4 text-sm leading-6 text-neutral-700">
                <p className="font-medium text-neutral-900">
                  {order.shippingFullName}
                </p>

                <p>{order.shippingHouseNo}</p>

                <p>{order.shippingAddressLine}</p>

                <p>
                  {order.shippingCity}, {order.shippingState}{" "}
                  {order.shippingPincode}
                </p>

                <p>{order.shippingCountry}</p>

                <p className="mt-2">{order.shippingPhone}</p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold">Customer</h2>

              <div className="mt-4">
                <p className="text-sm font-medium text-neutral-900">
                  {order.user.name}
                </p>

                <p className="mt-1 break-all text-sm text-neutral-500">
                  {order.user.email}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold">Payment Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow
                  label="Subtotal"
                  value={`₹${Number(order.subtotal).toLocaleString("en-IN")}`}
                />

                <SummaryRow
                  label="Shipping"
                  value={`₹${Number(order.shippingAmount).toLocaleString(
                    "en-IN",
                  )}`}
                />

                <div className="border-t border-neutral-200 pt-3">
                  <SummaryRow
                    label="Total"
                    value={`₹${Number(order.totalAmount).toLocaleString(
                      "en-IN",
                    )}`}
                    strong
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold">Payment Details</h2>

              <div className="mt-4 space-y-3 text-sm">
                <SummaryRow label="Status" value={order.paymentStatus} />

                <SummaryRow
                  label="Provider"
                  value={order.paymentProvider ?? "Not set"}
                />

                <SummaryRow
                  label="Method"
                  value={order.paymentMethod ?? "Not set"}
                />

                <SummaryRow label="Currency" value={order.currency} />

                <SummaryRow
                  label="Paid At"
                  value={
                    order.paidAt
                      ? order.paidAt.toLocaleString("en-IN")
                      : "Not paid"
                  }
                />
              </div>
            </section>
            <OrderStatusControl
              orderId={order.id}
              currentStatus={order.status}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function OrderBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full bg-neutral-100 px-3 py-1">
      <span className="text-xs font-medium text-neutral-700">
        {label}: {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          strong ? "font-semibold text-neutral-900" : "text-neutral-500"
        }
      >
        {label}
      </span>

      <span
        className={
          strong ? "font-semibold text-neutral-900" : "text-neutral-800"
        }
      >
        {value}
      </span>
    </div>
  );
}
