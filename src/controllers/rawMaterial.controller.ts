import { Request, Response } from "express";
import { getAllRawMaterials, getRawMaterialById } from "../services/rawMaterial.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { paginationSchema } from "../utils/pagination";

export async function getAllRawMaterialsController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllRawMaterials(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all raw materials!", data, meta));
}

export async function getRawMaterialByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await getRawMaterialById(id);
  res.status(200).json(successResponse("Raw material is found!", result));
}
