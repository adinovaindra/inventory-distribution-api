import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createProductionOrderController, getAllProductionOrdersController, getProductionOrderByIdController, updateProductionOrderController } from "../controllers/productionOrder.controller";
import { authorize } from "../middlewares/role.middleware";

export const productionOrderRouter = express.Router();

/**
 * @openapi
 * /production-orders:
 *   get:
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         example: 5
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     tags:
 *       - Production Order
 *     summary: Get all production orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All production orders are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

productionOrderRouter.get("/", authenticate, getAllProductionOrdersController);

/**
 * @openapi
 * /production-orders/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Production Order
 *     summary: Get a production order by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Production order is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404:
 *         description: Production order not found
 *       429:
 *         description: Too many request
 */

productionOrderRouter.get("/:id", authenticate, getProductionOrderByIdController);

/**
 * @openapi
 * /production-orders:
 *   post:
 *     tags:
 *       - Production Order
 *     summary: Add a production order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rawMaterialId
 *               - productId
 *               - inputWeightPerKg
 *             properties:
 *               rawMaterialId:
 *                 type: number
 *                 example: 1
 *               productId:
 *                 type: number
 *                 example: 1
 *               inputWeightPerKg:
 *                 type: number
 *                 minimum: 100
 *                 example: 10000
 *     responses:
 *       201:
 *         description: Production order is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

productionOrderRouter.post("/", authenticate, authorize("ADMIN"), createProductionOrderController);

/**
 * @openapi
 * /production-orders/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Production Order
 *     summary: Update a production order by id
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               outputWeightPerKg:
 *                 type: number
 *                 example: 8000
 *               status:
 *                 type: string
 *                 enum: ["IN_PROGRESS", "COMPLETED", "CANCELLED"]
 *                 example: "IN_PROGRESS"
 *     responses:
 *       200:
 *         description: Production order is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Production order not found
 *       429:
 *         description: Too many request
 */

productionOrderRouter.put("/:id", authenticate, authorize("ADMIN"), updateProductionOrderController);
