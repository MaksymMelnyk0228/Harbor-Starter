import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-700",
        variant === "primary" && "bg-pine-800 text-white hover:bg-pine-700",
        variant === "secondary" && "bg-ink-950 text-white hover:bg-ink-900",
        variant === "ghost" && "bg-transparent text-ink-900 hover:bg-paper-100",
        variant === "danger" && "bg-clay-600 text-white hover:bg-clay-500",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6",
        className
      )}
      {...props}
    />
  );
}
