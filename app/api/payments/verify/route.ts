import crypto from "crypto";

import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

interface VerifyPaymentBody {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

type RazorpayPaymentMethod =
  | "card"
  | "upi"
  | "netbanking"
  | "wallet"
  | "paylater";

function mapPaymentMethod(method: string) {
  switch (method as RazorpayPaymentMethod) {
    case "card":
      return "CARD" as const;

    case "upi":
      return "UPI" as const;

    case "netbanking":
      return "NETBANKING" as const;

    case "wallet":
      return "WALLET" as const;

    case "paylater":
      return "PAYLATER" as const;

    default:
      return null;
  }
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

    /*
     * Idempotency:
     * If this payment was already successfully processed,
     * don't process it again.
     */
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

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpaySecret) {
      console.error("RAZORPAY_KEY_SECRET is not configured.");

      return NextResponse.json(
        { error: "Payment configuration error." },
        { status: 500 },
      );
    }

    /*
     * 1. Verify Razorpay signature.
     *
     * Razorpay signs:
     * razorpay_order_id|razorpay_payment_id
     */
    const generatedSignature = crypto
      .createHmac("sha256", razorpaySecret)
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

    /*
     * 2. Fetch the payment directly from Razorpay.
     *
     * Never trust only the browser response.
     */
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    /*
     * 3. Make sure this payment actually belongs
     *    to the Razorpay order we created.
     */
    if (payment.order_id !== order.razorpayOrderId) {
      return NextResponse.json(
        { error: "Payment does not belong to this order." },
        { status: 400 },
      );
    }

    /*
     * 4. Verify the amount.
     *
     * Razorpay amount is stored in paise.
     */
    const expectedAmount = Math.round(Number(order.totalAmount) * 100);

    if (payment.amount !== expectedAmount) {
      return NextResponse.json(
        { error: "Payment amount does not match the order." },
        { status: 400 },
      );
    }

    /*
     * 5. Only captured payments can become PAID.
     */
    if (payment.status !== "captured" || payment.captured !== true) {
      return NextResponse.json(
        {
          error: "Payment has not been captured yet.",
        },
        { status: 400 },
      );
    }

    const paymentMethod = mapPaymentMethod(payment.method);

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },

      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",

        paymentProvider: "RAZORPAY",
        paymentMethod,

        razorpayPaymentId,
        razorpaySignature,

        paymentFailureReason: null,
        paidAt: new Date(),
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
