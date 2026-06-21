import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { createDeliveryController, getAllDeliveriesController, getDeliveryByIdController, updateDeliveryController } from "../controllers/delivery.controller";

export const deliveryRouter = express.Router();

deliveryRouter.get("/", authenticate, getAllDeliveriesController);
deliveryRouter.get("/:id", authenticate, getDeliveryByIdController);
deliveryRouter.post("/", authenticate, authorize("ADMIN"), createDeliveryController);
deliveryRouter.put("/:id", authenticate, authorize("ADMIN", "DRIVER"), updateDeliveryController);
