import { Supplier, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginationQuery } from "../utils/pagination";

export async function findAllSupplierRepo(paginationQuery: PaginationQuery): Promise<Supplier[]> {
  return prisma.supplier.findMany({
    ...paginationQuery,
  });
}

export async function findSupplierByIdRepo(id: number): Promise<Supplier | null> {
  return prisma.supplier.findUnique({
    where: {
      id,
    },
  });
}

export async function createSupplierRepo(data: Prisma.SupplierCreateInput): Promise<Supplier> {
  return prisma.supplier.create({
    data,
  });
}

export async function updateSupplierByIdRepo(id: number, data: Prisma.SupplierUpdateInput): Promise<Supplier> {
  return prisma.supplier.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteSupplierByIdRepo(id: number): Promise<Supplier> {
  return prisma.supplier.delete({
    where: {
      id,
    },
  });
}
