import type { Request, Response } from "express";
import { checkoutSchema } from "../validators/schemas.js";
import * as orderService from "../services/orderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const body = checkoutSchema.parse(req.body);
  const order = await orderService.createOrder({
    userId: req.user!.id,
    email: body.email,
    name: body.name,
    shippingMethod: body.shippingMethod,
    address: body.address,
    items: body.items,
  });
  res.status(201).json(order);
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  res.json(await orderService.listOrdersForUser(req.user!.id));
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  res.json(await orderService.getOrderForUser(req.params.id, req.user!.id));
});
