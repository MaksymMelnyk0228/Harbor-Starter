import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";
import { getPaymentProvider } from "../payments/registry.js";
import { getOrderById } from "./orderService.js";

interface PayInput {
  orderId: string;
  userId: string;
  provider?: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  idempotencyKey?: string;
}

export async function payForOrder(input: PayInput) {
  const order = await getOrderById(input.orderId);
  if (order.userId !== input.userId) {
    throw new HttpError(403, "You cannot pay for this order");
  }

  const paidPayment = order.payments.find((payment) => payment.status === "paid");
  if (paidPayment) {
    if (order.status !== "confirmed") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "confirmed" },
      });
    }
    return { order: await getOrderById(order.id), payment: paidPayment };
  }

  if (input.idempotencyKey) {
    const existing = await prisma.payment.findFirst({
      where: { orderId: order.id, idempotencyKey: input.idempotencyKey },
    });
    if (existing) {
      return { order, payment: existing };
    }
  }

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "mock_card",
      method: "card",
      status: "processing",
      amount: order.total,
      currency: "USD",
      idempotencyKey: input.idempotencyKey,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "processing" },
  });

  const provider = getPaymentProvider(input.provider ?? "mock_card");
  const result = await provider.charge({
    kind: "card",
    amount: order.total,
    currency: "USD",
    cardNumber: input.cardNumber,
    expiration: input.expiration,
    cvv: input.cvv,
  });

  if (result.success) {
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "paid",
        last4: result.last4,
        brand: result.brand,
        failureReason: null,
      },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "confirmed" },
    });
    return { order: await getOrderById(order.id), payment: updated };
  }

  const failed = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "failed",
      last4: result.last4,
      brand: result.brand,
      failureReason: result.failureReason ?? "Payment failed",
    },
  });
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "pending" },
  });

  return { order: await getOrderById(order.id), payment: failed };
}
