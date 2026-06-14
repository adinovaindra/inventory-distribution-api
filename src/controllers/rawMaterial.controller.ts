import { Request, Response } from "express";
import { getAllRawMaterials, getRawMaterialById } from "../services/rawMaterial.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";

export async function getAllRawMaterialsController(req: Request, res: Response) {
  const result = await getAllRawMaterials();
  res.status(200).json(successResponse("Successfully retrieve all raw materials!", result));
}

export async function getRawMaterialByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await getRawMaterialById(id);
  res.status(200).json(successResponse("Raw material is found!", result));
}
