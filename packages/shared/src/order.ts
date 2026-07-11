import type { OrderStatus, PaymentStatus, ShippingMethod } from "./constants.js";
import type { CryptoPaymentFields } from "./payment.js";

export interface MoneyBreakdown {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface OrderLineInput {
  productId: string;
  quantity: number;
}

export interface PaymentSummary {
  id: string;
  provider: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  last4?: string | null;
  brand?: string | null;
  failureReason?: string | null;
  crypto?: CryptoPaymentFields;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  shippingMethod: ShippingMethod;
  totals: MoneyBreakdown;
  paymentStatus: PaymentStatus | "unpaid";
}
