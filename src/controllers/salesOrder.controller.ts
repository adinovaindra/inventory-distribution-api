import { Request, Response } from "express";
import { createSalesOrder, getAllSalesOrder, getSalesOrderById, updateSalesOrder } from "../services/salesOrder.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { createSalesOrderSchema, updateSalesOrderSchema } from "../validators/salesOrder.validator";
import { paginationSchema } from "../utils/pagination";

export async function getAllSalesOrderController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllSalesOrder(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all sales order!", data, meta));
}

export async function getSalesOrderByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await getSalesOrderById(id);
  res.status(200).json(successResponse("Sales order is found!", result));
}

export async function createSalesOrderController(req: Request, res: Response) {
  const salesOrderData = createSalesOrderSchema.parse(req.body);
  const result = await createSalesOrder(salesOrderData);
  res.status(201).json(successResponse("Sales order is successfully created!", result));
}

export async function updateSalesOrderController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const salesOrderData = updateSalesOrderSchema.parse(req.body);
  const result = await updateSalesOrder(id, salesOrderData);
  res.status(200).json(successResponse(`Sales order status is successfully updated to ${result.status}`, result));
}
