import { Prisma, ProcurementOrder } from "@prisma/client";
import { addProcurementOrderRepo, findAllProcurementOrdersRepo, findProcurementOrderByIdRepo, updateProcurementOrderRepo } from "../repositories/procurementOrder.repository";
import { NotFoundError } from "../utils/error";
import { CreateProcurementOrderInput, UpdateProcurementOrderInput } from "../validators/procurementOrder.validator";
import { getSupplierById } from "./supplier.service";
import { getContractById } from "./contract.service";

export async function getAllProcurementOrders(): Promise<ProcurementOrder[]> {
  return findAllProcurementOrdersRepo();
}

export async function getProcurementOrderById(id: number): Promise<ProcurementOrder> {
  const procurementOrderData = await findProcurementOrderByIdRepo(id);

  if (!procurementOrderData) {
    throw new NotFoundError("Procurement Order is not found!");
  }

  return procurementOrderData;
}

export async function createProcurementOrder(data: CreateProcurementOrderInput): Promise<ProcurementOrder> {
  await getSupplierById(data.supplierId);

  if (data.contractId) {
    await getContractById(data.contractId);
  }

  return addProcurementOrderRepo({
    ...data,
    orderDate: new Date(data.orderDate),
  });
}

export async function updateProcurementOrder(id: number, data: UpdateProcurementOrderInput): Promise<ProcurementOrder> {
  try {
    return await updateProcurementOrderRepo(id, data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new NotFoundError("Procurement Order is not found");
    }
    throw error;
  }
}
