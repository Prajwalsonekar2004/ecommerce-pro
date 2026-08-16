"use client";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
}

export default function ColorSelectorProps({
  colors,
  selectedColor,
  onChange,
}: ColorSelectorProps) {
  if (colors.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text font-medium text-neutral-900">Color</p>

        <span className="text-sm text-neutral-500">{selectedColor}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selectedColor === color
                ? "border-black bg-black text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-black"
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}
