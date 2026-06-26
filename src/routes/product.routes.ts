import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "../controllers/product.controller";
import { authorize } from "../middlewares/role.middleware";

export const productRouter = express.Router();

/**
 * @openapi
 * /products:
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
 *       - Product
 *     summary: Get all products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products are found
 *       401:
 *         description: No token provided
 *       429:
 *         description: Too many request
 */

productRouter.get("/", authenticate, getAllProductsController);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Product
 *     summary: Get a product by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       404: 
 *         description: Product not found
 *       429:
 *         description: Too many request
 */

productRouter.get("/:id", authenticate, getProductByIdController);

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Product
 *     summary: Add a product
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
 *             properties:
 *               name:
 *                 type: string
 *                 enum: ["DUA_KURMA", "STRAWBERRY", "PRODUCTBULOG"]
 *                 example: "DUA_KURMA"
 *               description:
 *                 type: string
 *                 example: "Beras DUA_KURMA Premium"
 *     responses:
 *       201:
 *         description: Product is successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       429:
 *         description: Too many request
 */

productRouter.post("/", authenticate, authorize("ADMIN"), createProductController);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Product
 *     summary: Update a product by id
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
 *                 enum: ["DUA_KURMA", "STRAWBERRY", "PRODUCTBULOG"]
 *                 example: "DUA_KURMA"
 *               description:
 *                 type: string
 *                 example: "Beras DUA_KURMA Premium"
 *     responses:
 *       200:
 *         description: Product is successfully updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Product not found
 *       429:
 *         description: Too many request
 */

productRouter.put("/:id", authenticate, authorize("ADMIN"), updateProductController);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Product
 *     summary: Delete a product by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product is successfully deleted
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 *       404:
 *         description: Product not found
 *       429:
 *         description: Too many request
 */

productRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteProductController);
