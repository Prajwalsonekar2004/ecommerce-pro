"use client";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onChange: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onChange,
}: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-900">Select Size</p>

        <button
          type="button"
          className="text-xs text-neutral-500 underline underline-offset-4"
        >
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`h-11 rounded-md border text-sm font-medium transition ${
              selectedSize === size
                ? "border-black bg-black text-white"
                : "border-neutral-300 bg-white text-neutral-800 hover:border-black"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
