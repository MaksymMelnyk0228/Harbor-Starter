import type { Request, Response } from "express";
import { updateCartSchema } from "../validators/schemas.js";
import * as cartService from "../services/cartService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  res.json(await cartService.getCart(req.user!.id));
});

export const saveCart = asyncHandler(async (req: Request, res: Response) => {
  const body = updateCartSchema.parse(req.body);
  res.json(await cartService.replaceCart(req.user!.id, body.items));
});
