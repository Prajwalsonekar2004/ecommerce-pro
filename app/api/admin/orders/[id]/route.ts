import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
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
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    session,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (admin.error) {
    return admin.error;
  }

  const { id } = await context.params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
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
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({
      order,
    });
  } catch (error) {
    console.error("Admin order fetch failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch order." },
      { status: 500 },
    );
  }
}

const ORDER_STATUS_TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
} as const;

type OrderStatus = keyof typeof ORDER_STATUS_TRANSITIONS;

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (admin.error) {
    return admin.error;
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const nextStatus = body?.status as OrderStatus;

    if (
      typeof nextStatus !== "string" ||
      !Object.prototype.hasOwnProperty.call(
        ORDER_STATUS_TRANSITIONS,
        nextStatus,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 },
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.status === nextStatus) {
      return NextResponse.json({
        message: "Order status is already set to this value.",
        order,
      });
    }

    const allowedTransitions =
      ORDER_STATUS_TRANSITIONS[
        order.status as keyof typeof ORDER_STATUS_TRANSITIONS
      ];

    if (!allowedTransitions.includes(nextStatus as never)) {
      return NextResponse.json(
        {
          error: `Order cannot move from ${order.status} to ${nextStatus}.`,
        },
        { status: 409 },
      );
    }

    if (nextStatus === "CANCELLED" && order.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          error:
            "A paid order cannot be cancelled until its payment is refunded.",
        },
        { status: 409 },
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: nextStatus,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Admin order status update failed:", error);

    return NextResponse.json(
      { error: "Unable to update order status." },
      { status: 500 },
    );
  }
}
