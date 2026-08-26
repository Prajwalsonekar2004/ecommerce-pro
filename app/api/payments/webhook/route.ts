import crypto from "crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const SUPPORTED_EVENTS = new Set([
  "payment.captured",
  "payment.failed",
  "order.paid",
]);

function getPaymentMethod(method?: string | null) {
  switch (method) {
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

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const received = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (received.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(received, expected);
}

export async function POST(request: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured.");

      return NextResponse.json(
        { error: "Webhook configuration error." },
        { status: 500 },
      );
    }

    /*
     * IMPORTANT:
     * Razorpay signature must be generated from the exact raw body.
     * Do not call request.json() before this.
     */
    const rawBody = await request.text();

    const signature = request.headers.get("x-razorpay-signature");
    const eventId = request.headers.get("x-razorpay-event-id");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Razorpay signature." },
        { status: 400 },
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing Razorpay event ID." },
        { status: 400 },
      );
    }

    const isValidSignature = verifyWebhookSignature(rawBody, signature, secret);

    if (!isValidSignature) {
      console.error("Invalid Razorpay webhook signature.");

      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 },
      );
    }

    let event: {
      event?: string;
      created_at?: number;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
            currency?: string;
            method?: string;
            status?: string;
            error_description?: string;
          };
        };
        order?: {
          entity?: {
            id?: string;
            amount?: number;
            amount_paid?: number;
            currency?: string;
            status?: string;
          };
        };
      };
    };

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid webhook payload." },
        { status: 400 },
      );
    }

    const eventType = event.event;

    if (!eventType) {
      return NextResponse.json(
        { error: "Missing webhook event type." },
        { status: 400 },
      );
    }

    /*
     * We only process events that affect our payment state.
     * Other valid Razorpay events receive 200 and are ignored.
     */
    if (!SUPPORTED_EVENTS.has(eventType)) {
      return NextResponse.json({
        success: true,
        ignored: true,
        event: eventType,
      });
    }

    /*
     * Razorpay can retry the same event.
     * eventId is unique in our database, so duplicate delivery
     * cannot process the same event twice.
     */
    const existingEvent = await prisma.razorpayWebhookEvent.findUnique({
      where: {
        eventId,
      },
    });

    if (existingEvent?.processed) {
      return NextResponse.json({
        success: true,
        duplicate: true,
      });
    }

    if (!existingEvent) {
      await prisma.razorpayWebhookEvent.create({
        data: {
          eventId,
          eventType,
          payload: JSON.parse(rawBody),
        },
      });
    }

    const payment = event.payload?.payment?.entity;

    const razorpayOrderId = payment?.order_id;

    if (!razorpayOrderId) {
      if (existingEvent) {
        await prisma.razorpayWebhookEvent.update({
          where: {
            eventId,
          },
          data: {
            processed: true,
            processedAt: new Date(),
          },
        });
      } else {
        await prisma.razorpayWebhookEvent.update({
          where: {
            eventId,
          },
          data: {
            processed: true,
            processedAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        ignored: true,
        reason: "No Razorpay order ID.",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        razorpayOrderId,
      },
    });

    if (!order) {
      console.error(
        `Razorpay webhook received for unknown order: ${razorpayOrderId}`,
      );

      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const paymentMethod = getPaymentMethod(payment?.method);

    /*
     * payment.captured / order.paid
     *
     * Never downgrade an already-paid order because webhook
     * delivery order is not guaranteed.
     */
    if (eventType === "payment.captured" || eventType === "order.paid") {
      if (eventType === "payment.captured") {
        const expectedAmount = Math.round(Number(order.totalAmount) * 100);

        if (
          typeof payment?.amount === "number" &&
          payment.amount !== expectedAmount
        ) {
          console.error(
            `Payment amount mismatch for order ${order.orderNumber}.`,
          );

          return NextResponse.json(
            { error: "Payment amount mismatch." },
            { status: 400 },
          );
        }

        if (payment?.currency && payment.currency !== order.currency) {
          console.error(
            `Payment currency mismatch for order ${order.orderNumber}.`,
          );

          return NextResponse.json(
            { error: "Payment currency mismatch." },
            { status: 400 },
          );
        }
      }

      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus: "PAID",
          status:
            order.status === "PENDING" || order.status === "CONFIRMED"
              ? "CONFIRMED"
              : order.status,

          paymentProvider: "RAZORPAY",

          ...(paymentMethod
            ? {
                paymentMethod,
              }
            : {}),

          ...(payment?.id
            ? {
                razorpayPaymentId: payment.id,
              }
            : {}),

          paidAt: order.paidAt ?? new Date(),

          paymentFailureReason: null,
        },
      });
    }

    /*
     * Failed payment should never overwrite a successful payment.
     */
    if (eventType === "payment.failed") {
      if (order.paymentStatus !== "PAID") {
        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            paymentStatus: "FAILED",

            paymentProvider: "RAZORPAY",

            ...(paymentMethod
              ? {
                  paymentMethod,
                }
              : {}),

            ...(payment?.id
              ? {
                  razorpayPaymentId: payment.id,
                }
              : {}),

            paymentFailureReason:
              payment?.error_description ?? "Payment failed.",
          },
        });
      }
    }

    await prisma.razorpayWebhookEvent.update({
      where: {
        eventId,
      },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      processed: true,
      event: eventType,
    });
  } catch (error) {
    console.error("POST /api/payments/webhook failed:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed.",
      },
      { status: 500 },
    );
  }
}
