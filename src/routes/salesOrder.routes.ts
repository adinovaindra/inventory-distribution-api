import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createSalesOrderController, getAllSalesOrderController, getSalesOrderByIdController, updateSalesOrderController } from "../controllers/salesOrder.controller";
import { authorize } from "../middlewares/role.middleware";

export const salesOrderRouter = express.Router();

salesOrderRouter.get("/", authenticate, getAllSalesOrderController);
salesOrderRouter.get("/:id", authenticate, getSalesOrderByIdController);
salesOrderRouter.post("/", authenticate, authorize("ADMIN"), createSalesOrderController);
salesOrderRouter.put("/:id", authenticate, authorize("ADMIN"), updateSalesOrderController);
