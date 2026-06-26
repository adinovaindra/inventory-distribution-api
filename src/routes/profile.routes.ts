import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize, authorizeSelfOrAdmin } from "../middlewares/role.middleware";
import { deleteProfile, getProfile, updateProfile } from "../controllers/profile.controller";

export const profileRouter = express.Router();

/**
 * @openapi
 * /profiles/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Profile
 *     summary: Get a profile by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is found
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only or own profile
 *       404: 
 *         description: User not found
 *       429:
 *         description: Too many request
 */

profileRouter.get("/:id", authenticate, authorizeSelfOrAdmin, getProfile);

/**
 * @openapi
 * /profiles/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Profile
 *     summary: Update a profile by id
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
 *                 example: "Adinova Indra Permana"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only or own profile
 *       404: 
 *         description: User not found
 *       429:
 *         description: Too many request
 */

profileRouter.put("/:id", authenticate, authorizeSelfOrAdmin, updateProfile);

/**
 * @openapi
 * /profiles/{id}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     tags:
 *       - Profile
 *     summary: Delete an existing profile by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only or own profile
 *       404: 
 *         description: User not found
 *       429:
 *         description: Too many request
 */

profileRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteProfile);
