import type { Request, Response } from "express";
import * as catalogService from "../services/catalogService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const home = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await catalogService.getHomeData());
});

export const categories = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await catalogService.listCategories());
});

export const products = asyncHandler(async (req: Request, res: Response) => {
  const result = await catalogService.listProducts({
    search: stringParam(req.query.search),
    category: stringParam(req.query.category),
    minPrice: numberParam(req.query.minPrice),
    maxPrice: numberParam(req.query.maxPrice),
    sort: stringParam(req.query.sort),
    page: numberParam(req.query.page),
    pageSize: numberParam(req.query.pageSize),
    featured: req.query.featured === "1" || req.query.featured === "true",
    recommended: req.query.recommended === "1" || req.query.recommended === "true",
  });
  res.json(result);
});

export const product = asyncHandler(async (req: Request, res: Response) => {
  res.json(await catalogService.getProduct(req.params.id));
});

function stringParam(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function numberParam(value: unknown): number | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
