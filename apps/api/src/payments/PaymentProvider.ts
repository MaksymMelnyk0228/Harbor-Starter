import type {
  ChargeInput,
  ChargeResult,
  PaymentMethodKind,
  PaymentProvider,
} from "@ecommerce/shared";

export type { ChargeInput, ChargeResult, PaymentProvider };

export abstract class BasePaymentProvider implements PaymentProvider {
  abstract readonly id: string;
  abstract readonly method: PaymentMethodKind;
  abstract charge(input: ChargeInput): Promise<ChargeResult>;
}
