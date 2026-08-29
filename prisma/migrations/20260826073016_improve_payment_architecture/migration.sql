/*
  Payment architecture upgrade.

  Existing orders that previously stored:
    paymentMethod = RAZORPAY

  are migrated to:
    paymentProvider = RAZORPAY
    paymentMethod   = NULL

  paidAt and paymentFailureReason are nullable because
  existing/pending orders may not have either value.
*/

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('RAZORPAY');

-- Add new payment-related columns first
ALTER TABLE "public"."Order"
ADD COLUMN "paidAt" TIMESTAMP(3),
ADD COLUMN "paymentFailureReason" TEXT,
ADD COLUMN "paymentProvider" "public"."PaymentProvider";

-- Preserve existing payment provider information
UPDATE "public"."Order"
SET "paymentProvider" = 'RAZORPAY'
WHERE "paymentMethod"::text = 'RAZORPAY';

-- Replace PaymentMethod enum safely
BEGIN;

CREATE TYPE "public"."PaymentMethod_new" AS ENUM (
    'CARD',
    'UPI',
    'NETBANKING',
    'WALLET',
    'PAYLATER'
);

ALTER TABLE "public"."Order"
ALTER COLUMN "paymentMethod"
TYPE "public"."PaymentMethod_new"
USING (
    CASE
        WHEN "paymentMethod"::text = 'RAZORPAY'
            THEN NULL
        ELSE "paymentMethod"::text::"public"."PaymentMethod_new"
    END
);

ALTER TYPE "public"."PaymentMethod"
RENAME TO "PaymentMethod_old";

ALTER TYPE "public"."PaymentMethod_new"
RENAME TO "PaymentMethod";

DROP TYPE "public"."PaymentMethod_old";

COMMIT;

-- Create webhook event table
CREATE TABLE "public"."RazorpayWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RazorpayWebhookEvent_pkey"
        PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "RazorpayWebhookEvent_eventId_key"
ON "public"."RazorpayWebhookEvent"("eventId");

CREATE INDEX "RazorpayWebhookEvent_eventType_idx"
ON "public"."RazorpayWebhookEvent"("eventType");

CREATE INDEX "RazorpayWebhookEvent_createdAt_idx"
ON "public"."RazorpayWebhookEvent"("createdAt");