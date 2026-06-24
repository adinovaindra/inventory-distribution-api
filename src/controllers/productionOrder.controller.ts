import { Request, Response } from "express";
import { createProductionOrder, getAllProductionOrders, getProductionOrderById, updateProductionOrder } from "../services/productionOrder.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { createProductionOrderSchema, updateProductionOrderSchema } from "../validators/productionOrder.validator";
import { paginationSchema } from "../utils/pagination";

export async function getAllProductionOrdersController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllProductionOrders(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all production orders!", data, meta));
}

export async function getProductionOrderByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await getProductionOrderById(id);
  res.status(200).json(successResponse("Production order is found!", result));
}

export async function createProductionOrderController(req: Request, res: Response) {
  const productionOrderData = createProductionOrderSchema.parse(req.body);
  const result = await createProductionOrder(productionOrderData);
  res.status(201).json(successResponse("Production order is successfully created!", result));
}

export async function updateProductionOrderController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const productionOrderData = updateProductionOrderSchema.parse(req.body);
  const result = await updateProductionOrder(id, productionOrderData);
  res.status(200).json(successResponse("Production order is successfully updated!", result));
}
