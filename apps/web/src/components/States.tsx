import type { ReactNode } from "react";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-paper-200 border-t-pine-700" />
      <span>{label}…</span>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="surface mx-auto max-w-lg p-8 text-center">
      <p className="font-serif text-2xl">Something went sideways</p>
      <p className="mt-2 text-ink-500">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="surface mx-auto max-w-lg p-10 text-center">
      <p className="font-serif text-2xl">{title}</p>
      <p className="mt-2 text-ink-500">{body}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
