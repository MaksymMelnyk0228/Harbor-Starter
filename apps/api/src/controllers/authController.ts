import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/schemas.js";
import * as authService from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);
  const result = await authService.login(body.email, body.password);
  res.json(result);
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = registerSchema.parse(req.body);
  const result = await authService.register(body);
  res.status(201).json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const profile = await authService.getProfile(req.user!.id);
  res.json(profile);
});
