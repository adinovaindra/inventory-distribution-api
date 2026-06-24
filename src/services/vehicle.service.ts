import { Delivery, Prisma, Vehicle } from "@prisma/client";
import { addVehicleRepo, deleteVehicleRepo, findAllVehiclesRepo, findVehicleByIdRepo, updateVehicleRepo } from "../repositories/vehicle.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateVehicleInput, UpdateVehicleInput } from "../validators/vehicle.validator";
import { findActiveDeliveryByVehicleIdRepo, findDeliveryByVehicleIdRepo } from "../repositories/delivery.repository";
import { buildPaginationMeta, buildPaginationQuery } from "../utils/pagination";

export async function getAllVehicles(cursor: number | undefined, limit: number) {
  const paginationQuery = buildPaginationQuery(cursor, limit);
  const allVehicles = await findAllVehiclesRepo(paginationQuery);
  const paginationMeta = buildPaginationMeta(allVehicles, limit);
  return {
    data: allVehicles,
    meta: paginationMeta,
  };
}

export async function getVehicleById(id: number): Promise<Vehicle> {
  const vehicle = await findVehicleByIdRepo(id);

  if (!vehicle) {
    throw new NotFoundError("Vehicle is not found!");
  }

  return vehicle;
}

export async function createVehicle(vehicleData: CreateVehicleInput): Promise<Vehicle> {
  try {
    return await addVehicleRepo(vehicleData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new BadRequestError("Vehicle is already listed!");
    }
    throw error;
  }
}

export async function checkVehicleBeingUsed(vehicleId: number): Promise<Delivery | null> {
  const result = await findActiveDeliveryByVehicleIdRepo(vehicleId);

  if (result) {
    throw new BadRequestError("Request is denied due to vehicle is being used!");
  }

  return result;
}

export async function findVehicleAlreadyUsed(vehicleId: number): Promise<Delivery | null> {
  const result = await findDeliveryByVehicleIdRepo(vehicleId);

  if (result) {
    throw new BadRequestError("Unable to delete the vehicle which already used!");
  }
  return result;
}

export async function updateVehicle(id: number, vehicleData: UpdateVehicleInput): Promise<Vehicle> {
  try {
    const vehicle = await getVehicleById(id);
    await checkVehicleBeingUsed(vehicle.id);
    return await updateVehicleRepo(id, vehicleData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new BadRequestError("Vehicle is already listed!");
    }
    throw error;
  }
}

export async function deleteVehicle(id: number): Promise<Vehicle> {
  await getVehicleById(id);
  await findVehicleAlreadyUsed(id);
  return await deleteVehicleRepo(id);
}
