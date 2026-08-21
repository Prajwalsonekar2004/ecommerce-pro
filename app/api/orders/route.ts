import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

interface OrderItemInput {
  productId: string;
  size: string;
  color?: string | null;
  quantity: number;
}

interface CreateOrderBody {
  items: OrderItemInput[];
  addressId: string;
}

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `BHF-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateOrderBody;

    if (!body.addressId) {
      return NextResponse.json(
        { error: "Delivery address is required." },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your bag is empty." },
        { status: 400 },
      );
    }

    const address = await prisma.address.findFirst({
      where: {
        id: body.addressId,
        userId: user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Delivery address not found." },
        { status: 404 },
      );
    }

    const productIds = [...new Set(body.items.map((item) => item.productId))];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        isActive: true,
      },
      include: {
        images: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        sizes: true,
      },
    });

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    let subtotal = 0;

    const orderItems = [];

    for (const item of body.items) {
      if (
        !item.productId ||
        !item.size ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid cart item." },
          { status: 400 },
        );
      }

      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          {
            error: "One or more products are no longer available.",
          },
          { status: 400 },
        );
      }

      const productSize = product.sizes.find((size) => size.size === item.size);

      if (!productSize) {
        return NextResponse.json(
          {
            error: `${product.name} is not available in size ${item.size}.`,
          },
          { status: 400 },
        );
      }

      if (productSize.quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `${product.name} does not have enough stock for size ${item.size}.`,
          },
          { status: 400 },
        );
      }

      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * item.quantity;

      subtotal += totalPrice;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images[0]?.url ?? product.thumbnail ?? null,
        size: item.size,
        color: item.color ?? null,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const shippingAmount = 0;
    const totalAmount = subtotal + shippingAmount;

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount." },
        { status: 400 },
      );
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,

        status: "PENDING",

        subtotal,
        shippingAmount,
        totalAmount,

        currency: "INR",

        paymentStatus: "PENDING",

        shippingFullName: address.fullName,
        shippingPhone: address.phone,
        shippingPincode: address.pincode,
        shippingHouseNo: address.houseNo,
        shippingAddressLine: address.addressLine,
        shippingCity: address.city,
        shippingState: address.state,
        shippingCountry: "India",

        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: user.id,
      },
    });

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: Number(order.subtotal),
        shippingAmount: Number(order.shippingAmount),
        totalAmount: Number(order.totalAmount),
        currency: order.currency,
      },
      razorpay: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error("POST /api/orders failed:", error);

    return NextResponse.json(
      {
        error: "Unable to create your order. Please try again.",
      },
      { status: 500 },
    );
  }
}
