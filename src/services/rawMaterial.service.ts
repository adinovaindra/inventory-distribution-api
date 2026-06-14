import { RawMaterial } from "@prisma/client";
import { findAllRawMaterialsRepo, findRawMaterialByIdRepo } from "../repositories/rawMaterial.repository";
import { NotFoundError } from "../utils/error";

export async function getAllRawMaterials(): Promise<RawMaterial[]> {
  return findAllRawMaterialsRepo();
}

export async function getRawMaterialById(id: number): Promise<RawMaterial> {
  const rawMaterialData = await findRawMaterialByIdRepo(id);

  if (!rawMaterialData) {
    throw new NotFoundError("Raw Material is not found!");
  }
  return rawMaterialData;
}
