import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getAllRawMaterialsController, getRawMaterialByIdController } from "../controllers/rawMaterial.controller";

export const rawMaterialRouter = express.Router();

/**
 * @openapi
 * /raw-materials:
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
 *       - Raw Material
 *     summary: Get all raw materials
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All raw materials are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

rawMaterialRouter.get("/", authenticate, getAllRawMaterialsController);

/**
 * @openapi
 * /raw-materials/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Raw Material
 *     summary: Get a raw material by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Raw material is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Raw material not found
 *       429:
 *         description: Too many request
 */

rawMaterialRouter.get("/:id", authenticate, getRawMaterialByIdController);
