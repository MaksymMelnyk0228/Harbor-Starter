import { Star } from "lucide-react";

export function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          className={index < rounded ? "fill-clay-500 text-clay-500" : "text-paper-200"}
        />
      ))}
    </span>
  );
}
