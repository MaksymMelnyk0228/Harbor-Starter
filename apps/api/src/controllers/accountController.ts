import type { Request, Response } from "express";
import {
  addressSchema,
  savedProductSchema,
  updateProfileSchema,
} from "../validators/schemas.js";
import * as accountService from "../services/accountService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const body = updateProfileSchema.parse(req.body);
  res.json(await accountService.updateProfile(req.user!.id, body.name));
});

export const listAddresses = asyncHandler(async (req: Request, res: Response) => {
  res.json(await accountService.listAddresses(req.user!.id));
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const body = addressSchema.parse(req.body);
  const address = await accountService.createAddress(req.user!.id, body);
  res.status(201).json(address);
});

export const listSaved = asyncHandler(async (req: Request, res: Response) => {
  res.json(await accountService.listSaved(req.user!.id));
});

export const saveProduct = asyncHandler(async (req: Request, res: Response) => {
  const body = savedProductSchema.parse(req.body);
  res.status(201).json(await accountService.saveProduct(req.user!.id, body.productId));
});

export const unsaveProduct = asyncHandler(async (req: Request, res: Response) => {
  await accountService.unsaveProduct(req.user!.id, req.params.productId);
  res.status(204).send();
});
