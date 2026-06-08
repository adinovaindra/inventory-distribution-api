import express from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const authRouter = express.Router();

authRouter.post("/register", authenticate, authorize("ADMIN"), register);

authRouter.post("/login", login);

authRouter.post("/logout",authenticate, logout)

export { authRouter };
