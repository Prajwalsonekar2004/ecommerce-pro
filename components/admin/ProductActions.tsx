"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductActionsProps = {
  productId: string;
  isActive: boolean;
};

export default function ProductActions({
  productId,
  isActive,
}: ProductActionsProps) {
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isActiveState, setIsActiveState] = useState(isActive);
  const [error, setError] = useState("");

  async function toggleActive() {
    try {
      setIsUpdating(true);
      setError("");

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActiveState,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Unable to update product.",
        );
      }

      setIsActiveState(!isActiveState);
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Unable to update product.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={toggleActive}
        disabled={isUpdating}
        className={`rounded-full border px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isActiveState
            ? "border-red-200 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
            : "border-neutral-200 text-neutral-800 hover:border-black hover:bg-black hover:text-white"
        }`}
      >
        {isUpdating ? "Updating..." : isActiveState ? "Deactivate" : "Activate"}
      </button>

      {error ? (
        <p className="max-w-[220px] text-right text-[11px] text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
