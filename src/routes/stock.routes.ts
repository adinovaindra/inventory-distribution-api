import express from "express"
import { authenticate } from "../middlewares/auth.middleware"
import { getAllStocksController, getStockByIdController } from "../controllers/stock.controller"

export const stockRouter = express.Router()

/**
 * @openapi
 * /stocks:
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
 *       - Stock
 *     summary: Get all stocks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All stocks are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

stockRouter.get("/", authenticate, getAllStocksController)

/**
 * @openapi
 * /stocks/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Stock
 *     summary: Get a stock by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Stock not found
 *       429:
 *         description: Too many request
 */

stockRouter.get("/:id", authenticate, getStockByIdController)