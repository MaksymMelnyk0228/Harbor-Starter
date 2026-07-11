import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { HttpError } from "../utils/httpError.js";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    } satisfies TokenPayload,
    config.jwtSecret,
    { expiresIn: "7d" }
  );
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const user = readUser(req);
  if (!user) {
    next(new HttpError(401, "Authentication required"));
    return;
  }
  req.user = user;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  req.user = readUser(req) ?? undefined;
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const user = readUser(req);
  if (!user) {
    next(new HttpError(401, "Authentication required"));
    return;
  }
  if (user.role !== "admin") {
    next(new HttpError(403, "Admin access required"));
    return;
  }
  req.user = user;
  next();
}

function readUser(req: Request): AuthUser | null {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
