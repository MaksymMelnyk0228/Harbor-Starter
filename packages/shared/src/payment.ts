import type { PaymentStatus } from "./constants.js";

export type PaymentMethodKind = "card" | "crypto";

export interface CardChargeInput {
  kind: "card";
  amount: number;
  currency: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
}

/**
 * Shape for a future cryptocurrency charge.
 * Not used by the running application — the store works without a wallet.
 */
export interface CryptoChargeInput {
  kind: "crypto";
  amount: number;
  currency: string;
  walletAddress: string;
  network: string;
  token: string;
  cryptoAmount: string;
  txHash?: string;
}

export type ChargeInput = CardChargeInput | CryptoChargeInput;

export interface ChargeResult {
  success: boolean;
  provider: string;
  status: PaymentStatus;
  last4?: string;
  brand?: string;
  failureReason?: string;
  walletAddress?: string;
  network?: string;
  txHash?: string;
  token?: string;
  cryptoAmount?: string;
  confirmations?: number;
}

export interface PaymentProvider {
  readonly id: string;
  readonly method: PaymentMethodKind;
  charge(input: ChargeInput): Promise<ChargeResult>;
}

export interface CryptoPaymentFields {
  walletAddress?: string | null;
  network?: string | null;
  txHash?: string | null;
  cryptoAmount?: string | null;
  token?: string | null;
  confirmations?: number | null;
}
