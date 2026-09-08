import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      name: true,
      email: true,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/");
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalProducts,
    totalCustomers,
    totalOrders,
    todayOrders,
    paidSales,
    pendingOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count({
      where: { isActive: true },
    }),

    prisma.user.count({
      where: { role: "USER" },
    }),

    prisma.order.count(),

    prisma.order.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    }),

    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
      },
      _sum: {
        totalAmount: true,
      },
    }),

    prisma.order.count({
      where: {
        status: {
          in: ["PENDING", "PROCESSING"],
        },
      },
    }),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        shippingFullName: true,
      },
    }),
  ]);

  const totalSales = Number(paidSales._sum.totalAmount ?? 0);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b border-neutral-200 px-7 py-6">
              <div className="text-xl font-bold tracking-tight">
                BlackHeadFashion
              </div>
              <div className="mt-1 text-xs text-neutral-500">Admin Panel</div>
            </div>

            <nav className="flex-1 p-4">
              {[
                ["Dashboard", "/admin"],
                ["Products", "/admin/products"],
                ["Orders", "/admin/orders"],
                ["Customers", "/admin/customers"],
                ["Analytics", "/admin/analytics"],
                ["Settings", "/admin/settings"],
              ].map(([label, href], index) => (
                <a
                  key={href}
                  href={href}
                  className={`mb-1 flex rounded-xl px-4 py-3 text-sm font-medium transition ${
                    index === 0
                      ? "bg-black text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="border-t border-neutral-200 p-5">
              <div className="truncate text-sm font-medium">
                {admin.name || "Admin"}
              </div>
              <div className="mt-1 truncate text-xs text-neutral-500">
                {admin.email}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Mobile header */}
          <header className="border-b border-neutral-200 bg-white px-5 py-5 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Business overview and performance
                </p>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{admin.name || "Admin"}</p>
                <p className="text-xs text-neutral-500">Administrator</p>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] space-y-6 p-5 sm:p-8 lg:p-10">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <StatCard
                label="Total Sales"
                value={`₹${totalSales.toLocaleString("en-IN")}`}
              />

              <StatCard
                label="Orders Today"
                value={todayOrders.toLocaleString("en-IN")}
              />

              <StatCard
                label="Products"
                value={totalProducts.toLocaleString("en-IN")}
              />

              <StatCard
                label="Customers"
                value={totalCustomers.toLocaleString("en-IN")}
              />
            </div>

            {/* Business status */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Business Overview</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      Current store activity
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <MiniStat label="All Orders" value={totalOrders} />
                  <MiniStat label="Pending" value={pendingOrders} />
                  <MiniStat label="Today" value={todayOrders} />
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-black p-6 text-white">
                <p className="text-sm text-neutral-400">Store Status</p>

                <div className="mt-5 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="text-lg font-semibold">Live</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  Your storefront is active and accepting customers.
                </p>
              </div>
            </div>

            {/* Recent orders */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Latest customer activity
                  </p>
                </div>

                <a
                  href="/admin/orders"
                  className="text-sm font-medium hover:underline"
                >
                  View all
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="border-b border-neutral-200 bg-neutral-50">
                    <tr className="text-xs uppercase tracking-wide text-neutral-500">
                      <th className="px-6 py-4 font-medium">Order</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-sm text-neutral-500"
                        >
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-neutral-100 last:border-0"
                        >
                          <td className="px-6 py-4 text-sm font-medium">
                            #{order.orderNumber}
                          </td>

                          <td className="px-6 py-4 text-sm text-neutral-600">
                            {order.shippingFullName}
                          </td>

                          <td className="px-6 py-4">
                            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                              {order.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm font-medium">
                            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                          </td>

                          <td className="px-6 py-4 text-sm text-neutral-500">
                            {order.createdAt.toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-2 text-xl font-semibold">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
