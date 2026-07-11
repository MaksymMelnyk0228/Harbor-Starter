import {
  EXPRESS_SHIPPING_CENTS,
  FREE_SHIPPING_CENTS,
  STANDARD_SHIPPING_CENTS,
  TAX_RATE,
  type ShippingMethod,
} from "./constants.js";

export interface PricedLine {
  unitPrice: number;
  quantity: number;
}

export function shippingCost(subtotal: number, method: ShippingMethod): number {
  if (method === "express") {
    return EXPRESS_SHIPPING_CENTS;
  }
  return subtotal >= FREE_SHIPPING_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
}

export function calculateOrderTotals(
  lines: PricedLine[],
  shippingMethod: ShippingMethod
): { subtotal: number; tax: number; shipping: number; total: number } {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const shipping = shippingCost(subtotal, shippingMethod);
  const tax = Math.round(subtotal * TAX_RATE);
  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
  };
}
