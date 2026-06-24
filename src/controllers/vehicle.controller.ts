import { Request, Response } from "express";
import { createVehicle, deleteVehicle, getAllVehicles, getVehicleById, updateVehicle } from "../services/vehicle.service";
import { successResponse } from "../utils/response";
import { createVehicleSchema, updateVehicleSchema } from "../validators/vehicle.validator";
import { BadRequestError } from "../utils/error";
import { paginationSchema } from "../utils/pagination";

export async function getAllVehiclesController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllVehicles(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all vehicles!", data, meta));
}

export async function getVehicleByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await getVehicleById(id);
  res.status(200).json(successResponse("Vehicle is found!", result));
}

export async function createVehicleController(req: Request, res: Response) {
  const vehicleData = createVehicleSchema.parse(req.body);
  const result = await createVehicle(vehicleData);
  res.status(201).json(successResponse("Vehicle is successfully created!", result));
}

export async function updateVehicleController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const vehicleData = updateVehicleSchema.parse(req.body);
  const result = await updateVehicle(id, vehicleData);
  res.status(200).json(successResponse("Vehicle is successfully updated!", result));
}

export async function deleteVehicleController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await deleteVehicle(id);
  res.status(200).json(successResponse("Vehicle is successfully deleted!", result));
}
