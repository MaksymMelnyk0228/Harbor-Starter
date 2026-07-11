import type { PaymentMethodKind, PaymentProvider } from "@ecommerce/shared";
import { MockCardPaymentProvider } from "./MockCardPaymentProvider.js";

const mockCard = new MockCardPaymentProvider();

const providers: Record<string, PaymentProvider> = {
  mock_card: mockCard,
  card: mockCard,
};

export function getPaymentProvider(id: string = "mock_card"): PaymentProvider {
  const provider = providers[id];
  if (!provider) {
    throw new Error(`Unknown payment provider: ${id}`);
  }
  return provider;
}

export function getProviderByMethod(method: PaymentMethodKind): PaymentProvider {
  if (method === "crypto") {
    throw new Error("Cryptocurrency payments are not enabled.");
  }
  return mockCard;
}
