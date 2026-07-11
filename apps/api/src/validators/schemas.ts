import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(72),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80),
});

export const addressSchema = z.object({
  label: z.string().min(1).max(40),
  fullName: z.string().min(2).max(80),
  line1: z.string().min(3).max(120),
  line2: z.string().max(120).optional(),
  city: z.string().min(2).max(80),
  region: z.string().min(2).max(80),
  postalCode: z.string().min(3).max(20),
  country: z.string().min(2).max(80),
  phone: z.string().max(30).optional(),
  isDefault: z.boolean().optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartSchema = z.object({
  items: z.array(cartItemSchema).max(50),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
  address: addressSchema,
  shippingMethod: z.enum(["standard", "express"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, "Cart is empty"),
});

export const paymentSchema = z.object({
  orderId: z.string().min(1),
  provider: z.enum(["mock_card", "card"]).default("mock_card"),
  cardNumber: z.string().min(12).max(24),
  expiration: z.string().regex(/^\d{2}\/\d{2}$/, "Use MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/),
  idempotencyKey: z.string().min(8).max(80).optional(),
});

export const savedProductSchema = z.object({
  productId: z.string().min(1),
});

export const insightsQuerySchema = z.object({
  question: z.string().min(3).max(200),
});
