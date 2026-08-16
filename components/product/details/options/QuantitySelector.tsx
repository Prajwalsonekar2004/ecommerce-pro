"use client";

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onChange: (quantity: number) => void;
}

export default function QuantitySelector({
  quantity,
  stock,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-neutral-900">Quantity</p>

      <div className="flex h-11 w-fit items-center rounded-full border border-neutral-300">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="flex h-full w-11 items-centre justify-center text-lg text-neutral-700 disabled:text-neutral-300"
          area-label="decrease quantity"
        >
          -
        </button>

        <span className="w-10 text-center text-sm font-medium">{quantity}</span>

        <button
          type="button"
          onClick={() => onChange(Math.min(stock, quantity + 1))}
          disabled={quantity >= stock}
          className="flex h-full w-11 items-center justify-center text-lg text-neutral-700 disabled:text-neutral-300"
          aria-label="Increase quanity"
        >
          +
        </button>
      </div>
    </div>
  );
}
