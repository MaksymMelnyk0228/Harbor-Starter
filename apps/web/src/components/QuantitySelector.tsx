import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-paper-200 bg-white">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
