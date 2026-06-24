import { Supplier, Prisma } from "@prisma/client";
import { createSupplierRepo, deleteSupplierByIdRepo, findAllSupplierRepo, findSupplierByIdRepo, updateSupplierByIdRepo } from "../repositories/supplier.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateSupplierInput, UpdateSupplierInput } from "../validators/supplier.validator";
import { buildPaginationMeta, buildPaginationQuery, PaginationMeta } from "../utils/pagination";

export async function getAllSupplier(cursor: number | undefined, limit: number) {
  const paginationQuery = buildPaginationQuery(cursor, limit);
  const allSuppliers = await findAllSupplierRepo(paginationQuery);
  const paginationMeta = buildPaginationMeta(allSuppliers, limit);
  return {
    data: allSuppliers,
    meta: paginationMeta,
  };
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const selectedSupplier = await findSupplierByIdRepo(id);

  if (!selectedSupplier) {
    throw new NotFoundError(`Supplier with id ${id} is not found!`);
  }
  return selectedSupplier;
}

export async function createSupplier(data: CreateSupplierInput): Promise<Supplier> {
  try {
    return await createSupplierRepo(data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new BadRequestError("Supplier already registered!");
    }
    throw error;
  }
}

export async function updateSupplier(id: number, data: UpdateSupplierInput): Promise<Supplier> {
  try {
    return await updateSupplierByIdRepo(id, data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError("Supplier is not found!");
      }
      if (error.code === "P2002") {
        throw new BadRequestError("Supplier already registered!");
      }
    }
    throw error;
  }
}

export async function deleteSupplier(id: number): Promise<Supplier> {
  try {
    return await deleteSupplierByIdRepo(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new NotFoundError("Supplier is not found!");
    }
    throw error;
  }
}
