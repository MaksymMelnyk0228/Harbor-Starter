import { calculateOrderTotals, shippingCost } from "@ecommerce/shared";

export { calculateOrderTotals, shippingCost };

export function addDays(from: Date, days: number): Date {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatOrderNumber(sequence: number): string {
  return `HB-${String(sequence).padStart(5, "0")}`;
}
