import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createProcurementOrderController, getAllProcurementOrdersController, getProcurementOrderByIdController, updateProcurementOrderController } from "../controllers/procurementOrder.controller";
import { authorize } from "../middlewares/role.middleware";

export const procurementOrderRouter = express.Router();

procurementOrderRouter.get("/", authenticate, getAllProcurementOrdersController);
procurementOrderRouter.get("/:id", authenticate, getProcurementOrderByIdController);
procurementOrderRouter.post("/", authenticate, authorize("ADMIN"), createProcurementOrderController);
procurementOrderRouter.put("/:id", authenticate, authorize("ADMIN"), updateProcurementOrderController);
