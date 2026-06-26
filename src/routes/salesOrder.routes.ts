import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createSalesOrderController, getAllSalesOrderController, getSalesOrderByIdController, updateSalesOrderController } from "../controllers/salesOrder.controller";
import { authorize } from "../middlewares/role.middleware";

export const salesOrderRouter = express.Router();

/**
 * @openapi
 * /sales-orders:
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
 *       - Sales Order
 *     summary: Get all sales orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All sales orders are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

salesOrderRouter.get("/", authenticate, getAllSalesOrderController);

/**
 * @openapi
 * /sales-orders/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Sales Order
 *     summary: Get a sales order by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales order is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Sales order not found
 *       429:
 *         description: Too many request
 */

salesOrderRouter.get("/:id", authenticate, getSalesOrderByIdController);

/**
 * @openapi
 * /sales-orders:
 *   post:
 *     tags:
 *       - Sales Order
 *     summary: Add a sales order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerType
 *               - products
 *             properties:
 *               contractId:
 *                 type: number
 *                 example: 1
 *               customerName:
 *                 type: string
 *                 example: "Hartono"
 *               customerType:
 *                 type: string
 *                 enum: ["BULOG", "HOTEL", "RETAIL"]
 *                 example: "BULOG"
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - warehouseId
 *                     - quantityPerKg
 *                     - pricePerKg
 *                   properties:
 *                     productId:
 *                       type: number
 *                       example: 1
 *                     warehouseId:
 *                       type: number
 *                       example: 1
 *                     quantityPerKg:
 *                       type: number
 *                       minimum: 25
 *                       example: 50
 *                     pricePerKg:
 *                       type: number
 *                       minimum: 10000
 *                       example: 12000
 *     responses:
 *       201:
 *         description: Sales order is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

salesOrderRouter.post("/", authenticate, authorize("ADMIN"), createSalesOrderController);

/**
 * @openapi
 * /sales-orders/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Sales Order
 *     summary: Update a sales order by id
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
 *                 enum: ["PROCESSING", "READY"]
 *                 example: "PROCESSING"
 *     responses:
 *       200:
 *         description: Sales order is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Sales order not found
 *       429:
 *         description: Too many request
 */

salesOrderRouter.put("/:id", authenticate, authorize("ADMIN"), updateSalesOrderController);
