import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(requireAdmin);
adminRouter.get("/dashboard", adminController.dashboard);
adminRouter.get("/orders", adminController.orders);
adminRouter.get("/orders/:id", adminController.order);
adminRouter.get("/products", adminController.products);
adminRouter.get("/inventory", adminController.inventory);
adminRouter.get("/customers", adminController.customers);
adminRouter.get("/analytics", adminController.analytics);
adminRouter.get("/insights", adminController.insights);
adminRouter.post("/insights/chat", adminController.insightChat);
