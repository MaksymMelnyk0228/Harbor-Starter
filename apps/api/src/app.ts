import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { repoRoot } from "./lib/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { catalogRouter } from "./routes/catalog.js";
import { cartRouter } from "./routes/cart.js";
import { orderRouter } from "./routes/orders.js";
import { paymentRouter } from "./routes/payments.js";
import { accountRouter } from "./routes/account.js";
import { adminRouter } from "./routes/admin.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: config.clientOrigin,
    })
  );
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRouter);
  app.use("/api", catalogRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/account", accountRouter);
  app.use("/api/admin", adminRouter);

  app.use("/images", express.static(path.join(repoRoot, "apps", "web", "public", "images")));

  const hasWebBuild = config.isProduction && fs.existsSync(path.join(config.webDist, "index.html"));
  if (hasWebBuild) {
    app.use(express.static(config.webDist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(config.webDist, "index.html"));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
