import { describe, expect, it } from "vitest";
import { calculateOrderTotals, shippingCost } from "../utils/money.js";

describe("order total calculation", () => {
  it("computes subtotal, tax, and free standard shipping over the threshold", () => {
    const totals = calculateOrderTotals(
      [
        { unitPrice: 4999, quantity: 1 },
        { unitPrice: 2999, quantity: 1 },
      ],
      "standard"
    );

    expect(totals.subtotal).toBe(7998);
    expect(totals.tax).toBe(Math.round(7998 * 0.0875));
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(totals.subtotal + totals.tax + totals.shipping);
  });

  it("charges standard shipping below the free-shipping threshold", () => {
    expect(shippingCost(7499, "standard")).toBe(899);
    expect(shippingCost(7500, "standard")).toBe(0);
  });

  it("always charges express shipping", () => {
    expect(shippingCost(20000, "express")).toBe(1499);
  });

  it("multiplies unit price by quantity for the subtotal", () => {
    const totals = calculateOrderTotals([{ unitPrice: 4000, quantity: 3 }], "standard");
    expect(totals.subtotal).toBe(12000);
    expect(totals.shipping).toBe(0);
  });
});
