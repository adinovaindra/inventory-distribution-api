import { Prisma, ProcurementOrder } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginationQuery } from "../utils/pagination";

export async function findAllProcurementOrdersRepo(paginationQuery: PaginationQuery): Promise<ProcurementOrder[]> {
  return prisma.procurementOrder.findMany({
    ...paginationQuery,
  });
}

export async function findProcurementOrderByIdRepo(id: number): Promise<ProcurementOrder | null> {
  return prisma.procurementOrder.findUnique({
    where: {
      id,
    },
  });
}

export async function addProcurementOrderRepo(procurementOrderData: Prisma.ProcurementOrderUncheckedCreateInput): Promise<ProcurementOrder> {
  return prisma.procurementOrder.create({
    data: procurementOrderData,
  });
}

export async function updateProcurementOrderRepo(id: number, procurementOrderData: Prisma.ProcurementOrderUncheckedUpdateInput): Promise<ProcurementOrder> {
  return prisma.procurementOrder.update({
    where: {
      id,
    },
    data: procurementOrderData,
  });
}
