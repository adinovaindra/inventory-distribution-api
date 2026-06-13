import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createContractController, getAllContractsController, getContractByIdController, updateContractController } from "../controllers/contract.controller";
import { authorize } from "../middlewares/role.middleware";

export const contractRouter = express.Router();

contractRouter.get("/", authenticate, getAllContractsController);
contractRouter.get("/:id", authenticate, getContractByIdController);
contractRouter.post("/", authenticate, authorize("ADMIN"), createContractController);
contractRouter.put("/:id", authenticate, authorize("ADMIN"), updateContractController);
