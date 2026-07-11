import type { Request, Response } from "express";
import { paymentSchema } from "../validators/schemas.js";
import * as paymentService from "../services/paymentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const body = paymentSchema.parse(req.body);
  const result = await paymentService.payForOrder({
    orderId: body.orderId,
    userId: req.user!.id,
    provider: body.provider,
    cardNumber: body.cardNumber,
    expiration: body.expiration,
    cvv: body.cvv,
    idempotencyKey: body.idempotencyKey,
  });

  res.json(result);
});
