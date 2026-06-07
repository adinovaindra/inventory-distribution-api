import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeSelfOrAdmin } from "../middlewares/role.middleware";
import { getProfile } from "../controllers/profile.controller";

export const profileRouter = express.Router();

profileRouter.get("/:id", authenticate, authorizeSelfOrAdmin, getProfile);
