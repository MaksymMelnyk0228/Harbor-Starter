import { Router } from "express";
import * as accountController from "../controllers/accountController.js";
import { requireAuth } from "../middleware/auth.js";

export const accountRouter = Router();

accountRouter.patch("/profile", requireAuth, accountController.updateProfile);
accountRouter.get("/addresses", requireAuth, accountController.listAddresses);
accountRouter.post("/addresses", requireAuth, accountController.createAddress);
accountRouter.get("/saved", requireAuth, accountController.listSaved);
accountRouter.post("/saved", requireAuth, accountController.saveProduct);
accountRouter.delete("/saved/:productId", requireAuth, accountController.unsaveProduct);
