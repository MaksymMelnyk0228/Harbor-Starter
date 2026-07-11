import path from "node:path";
import "./lib/env.js";
import { repoRoot } from "./lib/env.js";

const isProduction = process.env.NODE_ENV === "production";

/** Dev CORS: Vite may bind 5173+ and users may open localhost or 127.0.0.1. */
const localDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

function resolveClientOrigin(): boolean | string | RegExp {
  if (process.env.CLIENT_ORIGIN) {
    return process.env.CLIENT_ORIGIN;
  }
  if (isProduction) {
    return true;
  }
  return localDevOrigin;
}

export const config = {
  isProduction,
  port: Number(process.env.PORT ?? (isProduction ? 3000 : 3001)),
  host: process.env.HOST ?? (isProduction ? "0.0.0.0" : "127.0.0.1"),
  clientOrigin: resolveClientOrigin(),
  jwtSecret: process.env.JWT_SECRET ?? "harbor-local-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  webDist: path.join(repoRoot, "apps", "web", "dist"),
};
