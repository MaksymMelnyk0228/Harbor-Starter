import { Router } from "express";
import * as catalogController from "../controllers/catalogController.js";

export const catalogRouter = Router();

catalogRouter.get("/home", catalogController.home);
catalogRouter.get("/categories", catalogController.categories);
catalogRouter.get("/products", catalogController.products);
catalogRouter.get("/products/:id", catalogController.product);
