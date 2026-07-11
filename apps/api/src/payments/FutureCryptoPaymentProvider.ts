import type { ChargeInput, ChargeResult } from "@ecommerce/shared";
import { BasePaymentProvider } from "./PaymentProvider.js";

/**
 * Reserved for a future cryptocurrency payment integration.
 *
 * A later change would implement wallet connection, network selection,
 * transaction hash tracking, token amounts, and confirmation counts.
 * This class is intentionally not registered in the live provider map.
 */
export class FutureCryptoPaymentProvider extends BasePaymentProvider {
  readonly id = "crypto";
  readonly method = "crypto" as const;

  async charge(input: ChargeInput): Promise<ChargeResult> {
    void input;
    throw new Error("Cryptocurrency payments are not enabled.");
  }
}
