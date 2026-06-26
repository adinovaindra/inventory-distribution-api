import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createVehicleController, deleteVehicleController, getAllVehiclesController, getVehicleByIdController, updateVehicleController } from "../controllers/vehicle.controller";
import { authorize } from "../middlewares/role.middleware";

export const vehicleRouter = express.Router();

/**
 * @openapi
 * /vehicles:
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
 *       - Vehicle
 *     summary: Get all vehicles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All vehicles are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

vehicleRouter.get("/", authenticate, getAllVehiclesController);

/**
 * @openapi
 * /vehicles/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Vehicle
 *     summary: Get a vehicle by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicle is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Vehicle not found
 *       429:
 *         description: Too many request
 */

vehicleRouter.get("/:id", authenticate, getVehicleByIdController);

/**
 * @openapi
 * /vehicles:
 *   post:
 *     tags:
 *       - Vehicle
 *     summary: Add a vehicle
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - type
 *               - capacityPerKg
 *             properties:
 *               plateNumber:
 *                 type: string
 *                 example: "AB 1123 QH"
 *               type:
 *                 type: string
 *                 enum: ["FUSO", "COLT_DIESEL", "PICKUP"]
 *                 example: "FUSO"
 *               capacityPerKg:
 *                 type: number
 *                 minimum: 1000
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Vehicle is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

vehicleRouter.post("/", authenticate, authorize("ADMIN"), createVehicleController);

/**
 * @openapi
 * /vehicles/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Vehicle
 *     summary: Update a vehicle by id
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plateNumber:
 *                 type: string
 *                 example: "AB 1123 QH"
 *               type:
 *                 type: string
 *                 enum: ["FUSO", "COLT_DIESEL", "PICKUP"]
 *                 example: "FUSO"
 *               capacityPerKg:
 *                 type: number
 *                 minimum: 1000
 *                 example: 5000
 *               isAvailable:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Vehicle is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Vehicle not found
 *       429:
 *         description: Too many request
 */

vehicleRouter.put("/:id", authenticate, authorize("ADMIN"), updateVehicleController);

/**
 * @openapi
 * /vehicles/{id}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Vehicle
 *     summary: Delete a vehicle by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicle is successfully deleted
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Vehicle not found
 *       429:
 *         description: Too many request
 */

vehicleRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteVehicleController);
