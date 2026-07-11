import { calculateOrderTotals, type ShippingMethod } from "@ecommerce/shared";

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function estimateCartTotals(
  items: Array<{ unitPrice: number; quantity: number }>,
  shippingMethod: ShippingMethod
) {
  return calculateOrderTotals(items, shippingMethod);
}

export function shippingLabel(method: ShippingMethod, shippingCents: number) {
  if (method === "express") return "Express (2 days)";
  return shippingCents === 0 ? "Free standard shipping" : "Standard (5–7 days)";
}
