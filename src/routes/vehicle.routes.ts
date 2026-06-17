import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createVehicleController, deleteVehicleController, getAllVehiclesController, getVehicleByIdController, updateVehicleController } from "../controllers/vehicle.controller";
import { authorize } from "../middlewares/role.middleware";

export const vehicleRouter = express.Router();

vehicleRouter.get("/", authenticate, getAllVehiclesController);
vehicleRouter.get("/:id", authenticate, getVehicleByIdController);
vehicleRouter.post("/", authenticate, authorize("ADMIN"), createVehicleController);
vehicleRouter.put("/:id", authenticate, authorize("ADMIN"), updateVehicleController);
vehicleRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteVehicleController);
