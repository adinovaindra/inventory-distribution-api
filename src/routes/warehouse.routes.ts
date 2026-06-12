import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createWarehouseController,
  deleteWarehouseController,
  getAllWarehouseController,
  getWarehouseByIdController,
  updateWarehouseController,
} from "../controllers/warehouse.controller";
import { authorize } from "../middlewares/role.middleware";

export const warehouseRouter = express.Router();

warehouseRouter.get("/", authenticate, getAllWarehouseController);
warehouseRouter.get("/:id", authenticate, getWarehouseByIdController);
warehouseRouter.post("/", authenticate, authorize("ADMIN"), createWarehouseController);
warehouseRouter.put("/:id", authenticate, authorize("ADMIN"), updateWarehouseController);
warehouseRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteWarehouseController);
