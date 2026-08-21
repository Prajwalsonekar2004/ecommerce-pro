import crypto from "crypto";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface VerifyPaymentBody {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
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

    const body = (await request.json()) as VerifyPaymentBody;

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Invalid payment response." },
        { status: 400 },
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        razorpayOrderId,
        userId: user.id,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (
      order.paymentStatus === "PAID" &&
      order.razorpayPaymentId === razorpayPaymentId
    ) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET is not configured.");

      return NextResponse.json(
        { error: "Payment configuration error." },
        { status: 500 },
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const receivedSignature = Buffer.from(razorpaySignature, "utf8");

    const expectedSignature = Buffer.from(generatedSignature, "utf8");

    if (receivedSignature.length !== expectedSignature.length) {
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 },
      );
    }

    const isValid = crypto.timingSafeEqual(
      receivedSignature,
      expectedSignature,
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 },
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        paymentMethod: "RAZORPAY",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
    });
  } catch (error) {
    console.error("POST /api/payments/verify failed:", error);

    return NextResponse.json(
      {
        error:
          "Unable to verify payment. Please contact support if money was deducted.",
      },
      { status: 500 },
    );
  }
}
