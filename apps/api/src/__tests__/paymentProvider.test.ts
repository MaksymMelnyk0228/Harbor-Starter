import { describe, expect, it } from "vitest";
import { MockCardPaymentProvider } from "../payments/MockCardPaymentProvider.js";

const provider = new MockCardPaymentProvider();

describe("mock card payment provider", () => {
  it("charges the demo success card", async () => {
    const result = await provider.charge({
      kind: "card",
      amount: 2599,
      currency: "USD",
      cardNumber: "4242 4242 4242 4242",
      expiration: "12/30",
      cvv: "123",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("paid");
    expect(result.last4).toBe("4242");
  });

  it("declines the demo failure card", async () => {
    const result = await provider.charge({
      kind: "card",
      amount: 2599,
      currency: "USD",
      cardNumber: "4000000000000002",
      expiration: "12/30",
      cvv: "123",
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("failed");
    expect(result.failureReason).toBe("Card declined");
  });
});
