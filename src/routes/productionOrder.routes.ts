import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createProductionOrderController, getAllProductionOrdersController, getProductionOrderByIdController, updateProductionOrderController } from "../controllers/productionOrder.controller";
import { authorize } from "../middlewares/role.middleware";

export const productionOrderRouter = express.Router();

productionOrderRouter.get("/", authenticate, getAllProductionOrdersController);
productionOrderRouter.get("/:id", authenticate, getProductionOrderByIdController);
productionOrderRouter.post("/", authenticate, authorize("ADMIN"), createProductionOrderController);
productionOrderRouter.put("/:id", authenticate, authorize("ADMIN"), updateProductionOrderController);
