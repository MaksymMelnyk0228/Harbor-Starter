import type { ShippingMethod } from "@ecommerce/shared";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";
import { addDays, calculateOrderTotals, formatOrderNumber } from "../utils/money.js";
import { assertAndDecrement } from "./inventoryService.js";

interface CheckoutInput {
  userId: string;
  email: string;
  name: string;
  shippingMethod: ShippingMethod;
  address: {
    label: string;
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
  };
  items: Array<{ productId: string; quantity: number }>;
}

export async function createOrder(input: CheckoutInput) {
  const uniqueIds = [...new Set(input.items.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: uniqueIds }, status: "active" },
    include: { inventory: true },
  });

  if (products.length !== uniqueIds.length) {
    throw new HttpError(400, "One or more products are unavailable");
  }

  const byId = new Map(products.map((product) => [product.id, product]));
  const pricedLines = input.items.map((item) => {
    const product = byId.get(item.productId);
    if (!product) {
      throw new HttpError(400, "Product not found");
    }
    return {
      product,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

  const totals = calculateOrderTotals(pricedLines, input.shippingMethod);
  const address = await prisma.address.create({
    data: {
      userId: input.userId,
      label: input.address.label || "Checkout",
      fullName: input.address.fullName,
      line1: input.address.line1,
      line2: input.address.line2,
      city: input.address.city,
      region: input.address.region,
      postalCode: input.address.postalCode,
      country: input.address.country,
      phone: input.address.phone,
      isDefault: Boolean(input.address.isDefault),
    },
  });

  const orderCount = await prisma.order.count();
  const order = await prisma.$transaction(async (tx) => {
    for (const line of pricedLines) {
      await assertAndDecrement(line.product.id, line.quantity, line.product.name, tx);
    }

    return tx.order.create({
      data: {
        orderNumber: formatOrderNumber(orderCount + 1001),
        userId: input.userId,
        addressId: address.id,
        status: "pending",
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total,
        shippingMethod: input.shippingMethod,
        estimatedDelivery: addDays(
          new Date(),
          input.shippingMethod === "express" ? 2 : 6
        ),
        customerEmail: input.email,
        customerName: input.name,
        items: {
          create: pricedLines.map((line) => ({
            productId: line.product.id,
            name: line.product.name,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
        },
      },
      include: orderInclude,
    });
  });

  return order;
}

export async function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderForUser(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: orderInclude,
  });
  if (!order) {
    throw new HttpError(404, "Order not found");
  }
  return order;
}

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });
  if (!order) {
    throw new HttpError(404, "Order not found");
  }
  return order;
}

export const orderInclude = {
  items: {
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" as const } },
          category: true,
        },
      },
    },
  },
  payments: { orderBy: { createdAt: "desc" as const } },
  address: true,
  user: { select: { id: true, name: true, email: true } },
};
