import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { requireAuth } from "../middleware/auth.js";

export const cartRouter = Router();

cartRouter.get("/", requireAuth, cartController.getCart);
cartRouter.post("/", requireAuth, cartController.saveCart);
