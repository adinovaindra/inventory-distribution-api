import express from "express";
import {
  createSupplierController,
  deleteSupplierController,
  getAllSupplierController,
  getSupplierByIdController,
  updateSupplierController,
} from "../controllers/supplier.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

export const supplierRouter = express.Router();

/**
 * @openapi
 * /suppliers:
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
 *       - Supplier
 *     summary: Get all suppliers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All suppliers are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

supplierRouter.get("/", authenticate, getAllSupplierController);

/**
 * @openapi
 * /suppliers/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Supplier
 *     summary: Get a supplier by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supplier is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Supplier not found
 *       429:
 *         description: Too many request
 */

supplierRouter.get("/:id", authenticate, getSupplierByIdController);

/**
 * @openapi
 * /suppliers:
 *   post:
 *     tags:
 *       - Supplier
 *     summary: Add a supplier
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
 *               - region
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sri Wahyuni"
 *               region:
 *                 type: string
 *                 enum: ["KEBUMEN", "PONOROGO", "DEMAK", "WONOGIRI"]
 *                 example: "DEMAK"
 *               phone:
 *                 type: string
 *                 example: "08123456789"
 *               address:
 *                 type: string
 *                 example: "Demak Raya RT 20, Demak"
 *     responses:
 *       201:
 *         description: Supplier is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

supplierRouter.post("/", authenticate, authorize("ADMIN"), createSupplierController);

/**
 * @openapi
 * /suppliers/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Supplier
 *     summary: Update a supplier
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
 *                 example: "Sri Wahyuni"
 *               region:
 *                 type: string
 *                 enum: ["KEBUMEN", "PONOROGO", "DEMAK", "WONOGIRI"]
 *                 example: "DEMAK"
 *               phone:
 *                 type: string
 *                 example: "08123456789"
 *               address:
 *                 type: string
 *                 example: "Demak Raya RT 20, Demak"
 *     responses:
 *       200:
 *         description: Supplier is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Supplier not found
 *       429:
 *         description: Too many request
 */

supplierRouter.put("/:id", authenticate, authorize("ADMIN"), updateSupplierController);

/**
 * @openapi
 * /suppliers/{id}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Supplier
 *     summary: Delete a supplier
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supplier is successfully deleted
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Supplier not found
 *       429:
 *         description: Too many request
 */

supplierRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteSupplierController);
