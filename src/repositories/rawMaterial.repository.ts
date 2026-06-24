import { RawMaterial, SupplierRegion } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginationQuery } from "../utils/pagination";

export async function findAllRawMaterialsRepo(paginationQuery: PaginationQuery): Promise<RawMaterial[]> {
  return prisma.rawMaterial.findMany({
    ...paginationQuery
  });
}

export async function findRawMaterialByIdRepo(id: number): Promise<RawMaterial | null> {
  return prisma.rawMaterial.findUnique({
    where: {
      id,
    },
  });
}

export async function addRawMaterialRepo(data: { procurementOrderId: number; warehouseId: number; region: SupplierRegion; weightPerKg: number; remainingWeightPerKg: number }): Promise<RawMaterial> {
  return prisma.rawMaterial.create({
    data,
  });
}

export async function UpdateRawMaterialRepo(rawMaterialId: number, remainingWeightPerKg: number) {
  return prisma.rawMaterial.update({
    where: {
      id: rawMaterialId,
    },
    data: {
      remainingWeightPerKg,
    },
  });
}
