import { Request, Response } from "express";
import {
  createSupplier,
  deleteSupplier,
  getAllSupplier,
  getSupplierById,
  updateSupplier,
} from "../services/supplier.service";
import { successResponse } from "../utils/response";
import { createSupplierSchema, updateSupplierSchema } from "../validators/supplier.validator";
import { BadRequestError } from "../utils/error";

export async function getAllSupplierController(req: Request, res: Response) {
  const result = await getAllSupplier();
  res.status(200).json(successResponse("Successfully retrieve all suppliers", result));
}

export async function getSupplierByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid id!");
  }

  const result = await getSupplierById(id);

  res.status(200).json(successResponse("Supplier is found!", result));
}

export async function createSupplierController(req: Request, res: Response) {
  const data = createSupplierSchema.parse(req.body);
  const result = await createSupplier(data);

  res.status(201).json(successResponse("Supplier is successfully created!", result));
}

export async function updateSupplierController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid id!");
  }

  const data = updateSupplierSchema.parse(req.body);

  const result = await updateSupplier(id, data);
  res.status(200).json(successResponse("Supplier is successfully updated!", result));
}

export async function deleteSupplierController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid id!");
  }

  await deleteSupplier(id);

  res.status(200).json(successResponse("Supplier is successfully deleted!"));
}
