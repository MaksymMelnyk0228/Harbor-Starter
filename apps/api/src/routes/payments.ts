import { Router } from "express";
import * as paymentController from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/auth.js";

export const paymentRouter = Router();

paymentRouter.post("/", requireAuth, paymentController.createPayment);
