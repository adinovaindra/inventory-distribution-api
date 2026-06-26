import express from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { authLimiter } from "../middlewares/ratelimiter.middleware";

const authRouter = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Adinova Indra Permana"
 *               email:
 *                 type: string
 *                 example: "adinovaindra@udbarokah.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, WAREHOUSE_STAFF, DRIVER]
 *                 example: "WAREHOUSE_STAFF"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

authRouter.post("/register", authenticate, authorize("ADMIN"), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "adminuser@barokah.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: User login successfully
 *       401:
 *         description: Invalid email or password
 *       429:
 *         description: Too many request
 */

authRouter.post("/login",authLimiter, login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout an existing user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logout successfully
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

authRouter.post("/logout",authenticate, logout)

export { authRouter };
