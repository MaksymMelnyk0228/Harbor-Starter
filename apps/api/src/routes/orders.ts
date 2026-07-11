import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";

export const orderRouter = Router();

orderRouter.post("/", requireAuth, orderController.createOrder);
orderRouter.get("/", requireAuth, orderController.listOrders);
orderRouter.get("/:id", requireAuth, orderController.getOrder);
