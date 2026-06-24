import { Request, Response } from "express";
import { addWarehouse, deleteWarehouse, getAllWarehouses, getWarehouseById, updateWarehouse } from "../services/warehouse.service";
import { BadRequestError } from "../utils/error";
import { successResponse } from "../utils/response";
import { createWarehouseSchema, updateWarehouseSchema } from "../validators/warehouse.validator";
import { paginationSchema } from "../utils/pagination";

export async function getAllWarehouseController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllWarehouses(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all warehouse!", data, meta));
}

export async function getWarehouseByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }

  const result = await getWarehouseById(id);
  res.status(200).json(successResponse("Warehouse is found!", result));
}

export async function createWarehouseController(req: Request, res: Response) {
  const warehouseData = createWarehouseSchema.parse(req.body);
  const result = await addWarehouse(warehouseData);
  res.status(201).json(successResponse(`Warehouse ${result.name} is successfully created!`, result));
}

export async function updateWarehouseController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }

  const warehouseData = updateWarehouseSchema.parse(req.body);

  const result = await updateWarehouse(id, warehouseData);
  res.status(200).json(successResponse(`Warehouse ${result.name} is successfully updated!`, result));
}

export async function deleteWarehouseController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await deleteWarehouse(id);
  res.status(200).json(successResponse(`Warehouse ${result.name} is successfully deleted!`, result));
}
