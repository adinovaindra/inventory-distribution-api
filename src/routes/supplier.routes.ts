import express from "express";
import {
  createSupplierController,
  deleteSupplierController,
  getAllSupplierController,
  getSupplierByIdController,
  updateSupplierController,
} from "../controllers/supplier.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

export const supplierRouter = express.Router();

supplierRouter.get("/", authenticate, getAllSupplierController);
supplierRouter.get("/:id", authenticate, getSupplierByIdController);
supplierRouter.post("/", authenticate, authorize("ADMIN"), createSupplierController);
supplierRouter.put("/:id", authenticate, authorize("ADMIN"), updateSupplierController);
supplierRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteSupplierController);
