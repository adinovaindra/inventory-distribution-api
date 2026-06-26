import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createWarehouseController,
  deleteWarehouseController,
  getAllWarehouseController,
  getWarehouseByIdController,
  updateWarehouseController,
} from "../controllers/warehouse.controller";
import { authorize } from "../middlewares/role.middleware";

export const warehouseRouter = express.Router();

/**
 * @openapi
 * /warehouses:
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
 *       - Warehouse
 *     summary: Get all warehouses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All warehouses are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

warehouseRouter.get("/", authenticate, getAllWarehouseController);

/**
 * @openapi
 * /warehouses/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Warehouse
 *     summary: Get a warehouse by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warehouse is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Warehouse not found
 *       429:
 *         description: Too many request
 */

warehouseRouter.get("/:id", authenticate, getWarehouseByIdController);

/**
 * @openapi
 * /warehouses:
 *   post:
 *     tags:
 *       - Warehouse
 *     summary: Add a warehouse
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
 *               - location
 *               - capacityPerKg
 *             properties:
 *               name:
 *                 type: string
 *                 example: "A"
 *               location:
 *                 type: string
 *                 example: "UD Barokah"
 *               capacityPerKg:
 *                 type: number
 *                 example: 100000
 *     responses:
 *       201:
 *         description: Warehouse is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

warehouseRouter.post("/", authenticate, authorize("ADMIN"), createWarehouseController);

/**
 * @openapi
 * /warehouses/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Warehouse
 *     summary: Update a warehouse
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "A"
 *               location:
 *                 type: string
 *                 example: "UD Barokah"
 *               capacityPerKg:
 *                 type: number
 *                 example: 100000
 *     responses:
 *       200:
 *         description: Warehouse is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Warehouse not found
 *       429:
 *         description: Too many request
 */

warehouseRouter.put("/:id", authenticate, authorize("ADMIN"), updateWarehouseController);

/**
 * @openapi
 * /warehouses/{id}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Warehouse
 *     summary: Delete a warehouse
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warehouse is successfully deleted
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Warehouse not found
 *       429:
 *         description: Too many request
 */

warehouseRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteWarehouseController);
