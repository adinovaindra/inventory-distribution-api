import { Prisma, Warehouse } from "@prisma/client";
import {
  checkRawMaterialAtWarehouse,
  checkStockAtWarehouse,
  createWarehouseRepo,
  deleteWarehouseRepo,
  findAllWarehouseRepo,
  findWarehouseByIdRepo,
  updateWarehouseRepo,
} from "../repositories/warehouse.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateWarehouseInput, UpdateWarehouseInput } from "../validators/warehouse.validator";

export async function getAllWarehouse(): Promise<Warehouse[]> {
  return findAllWarehouseRepo();
}

export async function getWarehouseById(id: number): Promise<Warehouse> {
  const warehouse = await findWarehouseByIdRepo(id);

  if (!warehouse) {
    throw new NotFoundError("Warehouse is not found!");
  }

  return warehouse;
}

export async function checkWarehouseStockAndMaterial(id: number) {
  const stockAtWarehouse = await checkStockAtWarehouse(id);
  const rawMaterialAtWarehouse = await checkRawMaterialAtWarehouse(id);

  if (stockAtWarehouse || rawMaterialAtWarehouse) {
    throw new BadRequestError("Unable to delete the Warehouse due to there is still stock or material in there!");
  }
}

export async function addWarehouse(warehouseData: CreateWarehouseInput): Promise<Warehouse> {
  try {
    return await createWarehouseRepo(warehouseData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new BadRequestError("Warehouse is already listed!");
    }
    throw error;
  }
}

export async function updateWarehouse(id: number, warehouseData: UpdateWarehouseInput): Promise<Warehouse> {
  try {
    return await updateWarehouseRepo(id, warehouseData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new BadRequestError("Warehouse is already listed!");
      }
      if (error.code === "P2025") {
        throw new NotFoundError("Warehouse is not found!");
      }
    }
    throw error;
  }
}

export async function deleteWarehouse(id: number): Promise<Warehouse> {
  await getWarehouseById(id);
  await checkWarehouseStockAndMaterial(id);
  return deleteWarehouseRepo(id);
}
