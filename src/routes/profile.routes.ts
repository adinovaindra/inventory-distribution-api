import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  authorize,
  authorizeSelfOrAdmin,
} from "../middlewares/role.middleware";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/profile.controller";

export const profileRouter = express.Router();

profileRouter.get("/:id", authenticate, authorizeSelfOrAdmin, getProfile);
profileRouter.put("/:id", authenticate, authorizeSelfOrAdmin, updateProfile);
profileRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteProfile);
