import { Request, Response } from "express";
import { createProcurementOrder, getAllProcurementOrders, getProcurementOrderById, updateProcurementOrder } from "../services/procurementOrder.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { createProcurementOrderSchema, updateProcurementOrderSchema } from "../validators/procurementOrder.validator";
import { paginationSchema } from "../utils/pagination";

export async function getAllProcurementOrdersController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllProcurementOrders(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all procurement orders!", data, meta));
}

export async function getProcurementOrderByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }

  const result = await getProcurementOrderById(id);
  res.status(200).json(successResponse("Procurement order is found!", result));
}

export async function createProcurementOrderController(req: Request, res: Response) {
  const data = createProcurementOrderSchema.parse(req.body);

  const result = await createProcurementOrder(data);
  res.status(201).json(successResponse("Procurement Order is successfully created!", result));
}

export async function updateProcurementOrderController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const data = updateProcurementOrderSchema.parse(req.body);
  const result = await updateProcurementOrder(id, data);
  res.status(200).json(successResponse(`Procurement order status is successfully updated to ${result.status}`, result));
}
