import express from "express"
import { authenticate } from "../middlewares/auth.middleware"
import { createMillingJobController, getAllMillingJobsController, getMillingJobByIdController, updateMillingJobController } from "../controllers/millingJobs.controller"
import { authorize } from "../middlewares/role.middleware"

export const millingJobRouter = express.Router()

/**
 * @openapi
 * /milling-jobs:
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
 *       - Milling Job
 *     summary: Get all milling jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All milling jobs are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

millingJobRouter.get("/", authenticate, getAllMillingJobsController)


/**
 * @openapi
 * /milling-jobs/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Milling Job
 *     summary: Get a milling job by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milling job is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Milling job not found
 *       429:
 *         description: Too many request
 */

millingJobRouter.get("/:id", authenticate, getMillingJobByIdController)

/**
 * @openapi
 * /milling-jobs:
 *   post:
 *     tags:
 *       - Milling Job
 *     summary: Add a milling job
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
 *               - inputWeightPerKg
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: "Wawan Jatmiko"
 *               customerPhone:
 *                 type: string
 *                 example: "08123456789"
 *               inputWeightPerKg:
 *                 type: number
 *                 minimum: 100
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Milling job is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

millingJobRouter.post("/", authenticate, authorize("ADMIN"), createMillingJobController)

/**
 * @openapi
 * /milling-jobs/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Milling Job
 *     summary: Update a milling job by id
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
 *                 enum: ["IN_PROGRESS", "COMPLETED", "CANCELLED"]
 *                 example: "IN_PROGRESS"
 *               outputUtuhPerKg:
 *                 type: number
 *                 example: 1000
 *               outputBrokenPerKg:
 *                 type: number
 *                 example: 1000
 *               outputMenirPerKg:
 *                 type: number
 *                 example: 1000
 *               outputRejectPerKg:
 *                 type: number
 *                 example: 1000
 *               outputKatulPerKg:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Milling job is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Milling job not found
 *       429:
 *         description: Too many request
 */

millingJobRouter.put("/:id", authenticate, authorize("ADMIN"), updateMillingJobController)