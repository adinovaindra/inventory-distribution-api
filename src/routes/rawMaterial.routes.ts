import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getAllRawMaterialsController, getRawMaterialByIdController } from "../controllers/rawMaterial.controller";

export const rawMaterialRouter = express.Router();

rawMaterialRouter.get("/", authenticate, getAllRawMaterialsController);
rawMaterialRouter.get("/:id", authenticate, getRawMaterialByIdController);
