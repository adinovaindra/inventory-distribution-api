import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { createDeliveryController, getAllDeliveriesController, getDeliveryByIdController, updateDeliveryController } from "../controllers/delivery.controller";

export const deliveryRouter = express.Router();

/**
 * @openapi
 * /deliveries:
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
 *       - Delivery
 *     summary: Get all deliveries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All deliveries are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

deliveryRouter.get("/", authenticate, getAllDeliveriesController);

/**
 * @openapi
 * /deliveries/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Delivery
 *     summary: Get a delivery by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Delivery not found
 *       429:
 *         description: Too many request
 */

deliveryRouter.get("/:id", authenticate, getDeliveryByIdController);

/**
 * @openapi
 * /deliveries:
 *   post:
 *     tags:
 *       - Delivery
 *     summary: Add a delivery
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salesOrderId
 *               - driverId
 *               - vehicleId
 *             properties:
 *               salesOrderId:
 *                 type: number
 *                 example: 1
 *               driverId:
 *                 type: number
 *                 example: 1
 *               vehicleId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Delivery is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

deliveryRouter.post("/", authenticate, authorize("ADMIN"), createDeliveryController);

/**
 * @openapi
 * /deliveries/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Delivery
 *     summary: Update a delivery by id
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
 *                 enum: ["DISPATCHED", "DELIVERED"]
 *                 example: "DISPATCHED"
 *     responses:
 *       200:
 *         description: Delivery is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin or driver only
 *       404:
 *         description: Delivery not found
 *       429:
 *         description: Too many request
 */

deliveryRouter.put("/:id", authenticate, authorize("ADMIN", "DRIVER"), updateDeliveryController);
