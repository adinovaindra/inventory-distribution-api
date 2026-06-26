import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createContractController, getAllContractsController, getContractByIdController, updateContractController } from "../controllers/contract.controller";
import { authorize } from "../middlewares/role.middleware";

export const contractRouter = express.Router();

/**
 * @openapi
 * /contracts:
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
 *       - Contract
 *     summary: Get all contracts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All contracts are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

contractRouter.get("/", authenticate, getAllContractsController);

/**
 * @openapi
 * /contracts/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Contract
 *     summary: Get a contract by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contract is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Contract not found
 *       429:
 *         description: Too many request
 */

contractRouter.get("/:id", authenticate, getContractByIdController);

/**
 * @openapi
 * /contracts:
 *   post:
 *     tags:
 *       - Contract
 *     summary: Add a contract
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contractNumber
 *               - totalWeightPerKg
 *               - pricePerKg
 *               - startDate
 *               - endDate
 *             properties:
 *               contractNumber:
 *                 type: string
 *                 example: "001/BRK/BULOG/06/2026"
 *               totalWeightPerKg:
 *                 type: number
 *                 example: 50000
 *               pricePerKg:
 *                 type: number
 *                 minimum: 6000
 *                 example: 10000
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-30"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-30"                 
 *     responses:
 *       201:
 *         description: Contract is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

contractRouter.post("/", authenticate, authorize("ADMIN"), createContractController);

/**
 * @openapi
 * /contracts/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Contract
 *     summary: Update a contract by id
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["COMPLETED", "CANCELLED"]
 *                 example: "COMPLETED"              
 *     responses:
 *       200:
 *         description: Contract is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Contract not found
 *       429:
 *         description: Too many request
 */

contractRouter.put("/:id", authenticate, authorize("ADMIN"), updateContractController);
