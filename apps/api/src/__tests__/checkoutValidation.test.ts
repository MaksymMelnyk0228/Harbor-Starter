import { describe, expect, it } from "vitest";
import { checkoutSchema, paymentSchema } from "../validators/schemas.js";

const validAddress = {
  label: "Home",
  fullName: "Ava Chen",
  line1: "18 Harbor Lane",
  city: "Portland",
  region: "OR",
  postalCode: "97201",
  country: "United States",
};

describe("checkout validation", () => {
  it("accepts a complete checkout payload", () => {
    const parsed = checkoutSchema.parse({
      email: "ava@example.com",
      name: "Ava Chen",
      address: validAddress,
      shippingMethod: "standard",
      items: [{ productId: "prod_1", quantity: 2 }],
    });
    expect(parsed.items).toHaveLength(1);
  });

  it("rejects an empty cart", () => {
    const result = checkoutSchema.safeParse({
      email: "ava@example.com",
      name: "Ava Chen",
      address: validAddress,
      shippingMethod: "standard",
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = checkoutSchema.safeParse({
      email: "not-an-email",
      name: "Ava Chen",
      address: validAddress,
      shippingMethod: "express",
      items: [{ productId: "prod_1", quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });
});

describe("payment validation", () => {
  it("requires MM/YY expiration", () => {
    const result = paymentSchema.safeParse({
      orderId: "order_1",
      cardNumber: "4242424242424242",
      expiration: "2026-12",
      cvv: "123",
    });
    expect(result.success).toBe(false);
  });
});
