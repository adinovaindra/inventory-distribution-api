import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "../controllers/product.controller";
import { authorize } from "../middlewares/role.middleware";

export const productRouter = express.Router();

productRouter.get("/", authenticate, getAllProductsController);
productRouter.get("/:id", authenticate, getProductByIdController);
productRouter.post("/", authenticate, authorize("ADMIN"), createProductController);
productRouter.put("/:id", authenticate, authorize("ADMIN"), updateProductController);
productRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteProductController);
