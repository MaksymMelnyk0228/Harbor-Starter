import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Field({ label, className, id, ...props }: InputProps) {
  const fieldId = id ?? props.name;
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <input
        id={fieldId}
        className={cn(
          "h-11 w-full rounded-xl border border-paper-200 bg-white px-3 text-ink-950 outline-none ring-pine-700/30 focus:ring-2",
          className
        )}
        {...props}
      />
    </label>
  );
}
