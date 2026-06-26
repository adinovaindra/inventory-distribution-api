import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createProcurementOrderController, getAllProcurementOrdersController, getProcurementOrderByIdController, updateProcurementOrderController } from "../controllers/procurementOrder.controller";
import { authorize } from "../middlewares/role.middleware";

export const procurementOrderRouter = express.Router();

/**
 * @openapi
 * /procurement-orders:
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
 *       - Procurement Order
 *     summary: Get all procurement orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All procurement orders are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

procurementOrderRouter.get("/", authenticate, getAllProcurementOrdersController);

/**
 * @openapi
 * /procurement-orders/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Procurement Order
 *     summary: Get a procurement order by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Procurement order is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Procurement order not found
 *       429:
 *         description: Too many request
 */

procurementOrderRouter.get("/:id", authenticate, getProcurementOrderByIdController);

/**
 * @openapi
 * /procurement-orders:
 *   post:
 *     tags:
 *       - Procurement Order
 *     summary: Add a procurement order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplierId
 *               - orderDate
 *               - totalWeightPerKg
 *               - pricePerKg
 *             properties:
 *               supplierId:
 *                 type: number
 *                 example: 1
 *               contractId:
 *                 type: number
 *                 example: 3
 *               orderDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-30"
 *               totalWeightPerKg:
 *                 type: number
 *                 example: 10000
 *               pricePerKg:
 *                 type: number
 *                 minimum: 6000
 *                 example: 11000
 *     responses:
 *       201:
 *         description: Procurement order is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

procurementOrderRouter.post("/", authenticate, authorize("ADMIN"), createProcurementOrderController);

/**
 * @openapi
 * /procurement-orders/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Procurement Order
 *     summary: Update a procurement order by id
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
 *               status:
 *                 type: string
 *                 enum: ["RECEIVED", "CANCELLED"]
 *                 example: "RECEIVED"
 *               warehouseId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Procurement order is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Procurement order not found
 *       429:
 *         description: Too many request
 */

procurementOrderRouter.put("/:id", authenticate, authorize("ADMIN"), updateProcurementOrderController);
