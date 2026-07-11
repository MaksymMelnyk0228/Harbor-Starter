import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  void req;
  void next;
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: {
        message: err.message,
        details: err.details ?? null,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Validation failed",
        details: err.flatten(),
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: {
      message: "Internal server error",
      details: null,
    },
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
      details: null,
    },
  });
}
