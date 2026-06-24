import { RawMaterial } from "@prisma/client";
import { findAllRawMaterialsRepo, findRawMaterialByIdRepo } from "../repositories/rawMaterial.repository";
import { NotFoundError } from "../utils/error";
import { buildPaginationMeta, buildPaginationQuery } from "../utils/pagination";

export async function getAllRawMaterials(cursor: number | undefined, limit: number) {
  const paginationQuery = buildPaginationQuery(cursor, limit);
  const allRawMaterials = await findAllRawMaterialsRepo(paginationQuery);
  const paginationMeta = buildPaginationMeta(allRawMaterials, limit);
  return {
    data: allRawMaterials,
    meta: paginationMeta,
  };
}

export async function getRawMaterialById(id: number): Promise<RawMaterial> {
  const rawMaterialData = await findRawMaterialByIdRepo(id);

  if (!rawMaterialData) {
    throw new NotFoundError("Raw Material is not found!");
  }
  return rawMaterialData;
}
