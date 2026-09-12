"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

type OrderStatusControlProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export default function OrderStatusControl({
  orderId,
  currentStatus,
}: OrderStatusControlProps) {
  const router = useRouter();

  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(nextStatus: OrderStatus) {
    if (nextStatus === status || isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);
      setError("");

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Unable to update order status.",
        );
      }

      setStatus(nextStatus);
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update order status.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold">Order Status</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Update the order fulfillment status.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="order-status"
          className="mb-2 block text-sm font-medium text-neutral-800"
        >
          Current status
        </label>

        <select
          id="order-status"
          value={status}
          disabled={isUpdating}
          onChange={(event) => updateStatus(event.target.value as OrderStatus)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-neutral-100"
        >
          {ORDER_STATUSES.map((orderStatus) => (
            <option key={orderStatus} value={orderStatus}>
              {orderStatus}
            </option>
          ))}
        </select>

        {isUpdating ? (
          <p className="mt-2 text-xs text-neutral-500">
            Updating order status...
          </p>
        ) : null}

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
