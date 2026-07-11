import { DEMO_CARDS, type ChargeInput, type ChargeResult } from "@ecommerce/shared";
import { BasePaymentProvider } from "./PaymentProvider.js";
import { HttpError } from "../utils/httpError.js";

const DECLINE_NUMBER = DEMO_CARDS.decline;

export class MockCardPaymentProvider extends BasePaymentProvider {
  readonly id = "mock_card";
  readonly method = "card" as const;

  async charge(input: ChargeInput): Promise<ChargeResult> {
    if (input.kind !== "card") {
      throw new HttpError(400, "Mock card provider received a non-card charge.");
    }

    const cardNumber = input.cardNumber.replace(/\s+/g, "");
    const last4 = cardNumber.slice(-4);
    const brand = detectBrand(cardNumber);

    if (!/^\d{13,19}$/.test(cardNumber)) {
      return {
        success: false,
        provider: this.id,
        status: "failed",
        last4,
        brand,
        failureReason: "Invalid card number",
      };
    }

    if (!/^\d{2}\/\d{2}$/.test(input.expiration)) {
      return {
        success: false,
        provider: this.id,
        status: "failed",
        last4,
        brand,
        failureReason: "Invalid expiration",
      };
    }

    if (!/^\d{3,4}$/.test(input.cvv)) {
      return {
        success: false,
        provider: this.id,
        status: "failed",
        last4,
        brand,
        failureReason: "Invalid CVV",
      };
    }

    if (cardNumber === DECLINE_NUMBER) {
      return {
        success: false,
        provider: this.id,
        status: "failed",
        last4,
        brand,
        failureReason: "Card declined",
      };
    }

    return {
      success: true,
      provider: this.id,
      status: "paid",
      last4,
      brand,
    };
  }
}

function detectBrand(cardNumber: string): string {
  if (cardNumber.startsWith("4")) return "visa";
  if (cardNumber.startsWith("5")) return "mastercard";
  if (cardNumber.startsWith("3")) return "amex";
  return "card";
}
