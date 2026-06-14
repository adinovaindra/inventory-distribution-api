import { ProcurementOrder } from "@prisma/client";
import { addProcurementOrderRepo, findAllProcurementOrdersRepo, findProcurementOrderByIdRepo, updateProcurementOrderRepo } from "../repositories/procurementOrder.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateProcurementOrderInput, UpdateProcurementOrderInput } from "../validators/procurementOrder.validator";
import { getSupplierById } from "./supplier.service";
import { getContractById } from "./contract.service";
import { getWarehouseById } from "./warehouse.service";
import { addRawMaterialRepo } from "../repositories/rawMaterial.repository";

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
  const procurementOrder = await getProcurementOrderById(id);

  if (procurementOrder.status === "RECEIVED") {
    throw new BadRequestError("Procurement order is already received and cannot be updated!");
  }

  if (data.status === "RECEIVED") {
    if (!data.warehouseId) {
      throw new BadRequestError("WarehouseId is required when status is RECEIVED!");
    }

    await getWarehouseById(data.warehouseId);
    const supplier = await getSupplierById(procurementOrder.supplierId);

    await addRawMaterialRepo({
      procurementOrderId: procurementOrder.id,
      warehouseId: data.warehouseId,
      region: supplier.region,
      weightPerKg: procurementOrder.totalWeightPerKg,
      remainingWeightPerKg: procurementOrder.totalWeightPerKg,
    });
  }

  return updateProcurementOrderRepo(id, {
    status: data.status,
  });
}
