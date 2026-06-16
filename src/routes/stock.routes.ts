import express from "express"
import { authenticate } from "../middlewares/auth.middleware"
import { getAllStocksController, getStockByIdController } from "../controllers/stock.controller"

export const stockRouter = express.Router()

stockRouter.get("/", authenticate, getAllStocksController)
stockRouter.get("/:id", authenticate, getStockByIdController)