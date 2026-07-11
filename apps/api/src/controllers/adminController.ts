import type { Request, Response } from "express";
import { insightsQuerySchema } from "../validators/schemas.js";
import * as adminService from "../services/adminService.js";
import * as insightService from "../services/insightService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboard = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await adminService.getDashboard());
});

export const orders = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await adminService.listAdminOrders());
});

export const order = asyncHandler(async (req: Request, res: Response) => {
  res.json(await adminService.getAdminOrder(req.params.id));
});

export const products = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await adminService.listAdminProducts());
});

export const inventory = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await adminService.getInventoryOverview());
});

export const customers = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await adminService.listCustomers());
});

export const analytics = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await adminService.getAnalytics());
});

export const insights = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await insightService.getInsightBoard());
});

export const insightChat = asyncHandler(async (req: Request, res: Response) => {
  const body = insightsQuerySchema.parse(req.body);
  res.json(await insightService.answerQuestion(body.question));
});
