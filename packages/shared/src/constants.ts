export const TAX_RATE = 0.0875;
export const FREE_SHIPPING_CENTS = 7500;
export const STANDARD_SHIPPING_CENTS = 899;
export const EXPRESS_SHIPPING_CENTS = 1499;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "refunded",
] as const;

export const PAYMENT_PROVIDERS = ["mock_card", "crypto"] as const;

export const DEMO_CARDS = {
  success: "4242424242424242",
  decline: "4000000000000002",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type PaymentProviderId = (typeof PAYMENT_PROVIDERS)[number];
export type ShippingMethod = "standard" | "express";
export type UserRole = "customer" | "admin";
export type ProductStatus = "active" | "draft" | "archived";
