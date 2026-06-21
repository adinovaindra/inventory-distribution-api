import { Request, Response } from "express";
import { createDelivery, getAllDeliveries, getDeliveryById, updateDelivery } from "../services/delivery.service";
import { successResponse } from "../utils/response";
import { BadRequestError, NotFoundError } from "../utils/error";
import { createDeliverySchema, updateDeliverySchema } from "../validators/delivery.validator";

export async function getAllDeliveriesController(req: Request, res: Response) {
  const result = await getAllDeliveries();
  res.status(200).json(successResponse("Successfully retrieve all deliveries!", result));
}

export async function getDeliveryByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await getDeliveryById(id);
  res.status(200).json(successResponse("Delivery is found!", result));
}

export async function createDeliveryController(req: Request, res: Response) {
  const deliveryData = createDeliverySchema.parse(req.body);
  const result = await createDelivery(deliveryData);
  res.status(201).json(successResponse("Delivery is successfully created!", result));
}

export async function updateDeliveryController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const deliveryData = updateDeliverySchema.parse(req.body);
  const result = await updateDelivery(id, deliveryData);
  res.status(200).json(successResponse(`Delivery is successfully updated to ${result.status}`, result));
}
