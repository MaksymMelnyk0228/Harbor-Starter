import { cn } from "../lib/cn";
import { useState } from "react";

const palettes: Record<string, [string, string]> = {
  electronics: ["#1f4d44", "#d7c4a3"],
  computers: ["#2c3a4f", "#c9d6d0"],
  accessories: ["#5b3a29", "#e4d3b8"],
  home: ["#6c4f3d", "#f0e2cf"],
  gaming: ["#1e2a28", "#7ea18a"],
  mobile: ["#3d2c2a", "#e7cbb8"],
};

export function ProductVisual({
  name,
  categorySlug,
  imageUrl,
  className,
}: {
  name: string;
  categorySlug: string;
  imageUrl?: string | null;
  className?: string;
}) {
  const candidate = imageUrl && !imageUrl.startsWith("visual://") ? imageUrl : null;
  const [failed, setFailed] = useState(false);
  const src = candidate && !failed ? candidate : null;
  const [from, to] = palettes[categorySlug] ?? ["#2a2622", "#d9cbb8"];

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-paper-100", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex h-full min-h-[12rem] items-end p-5"
          style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
          aria-hidden="true"
        >
          <span className="font-serif text-5xl text-white/90">{name.charAt(0)}</span>
        </div>
      )}
    </div>
  );
}
