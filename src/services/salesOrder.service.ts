import { SalesOrder } from "@prisma/client";
import { addSalesOrderRepo, findAllSalesOrdersRepo, findSalesOrderByIdRepo, updateSalesOrderRepo } from "../repositories/salesOrder.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateSalesOrderInput, UpdateSalesOrderInput } from "../validators/salesOrder.validator";
import { getContractById } from "./contract.service";
import { checkStockByProductIdRepo } from "../repositories/stock.repository";

export async function getAllSalesOrder(): Promise<SalesOrder[]> {
  return findAllSalesOrdersRepo();
}

export async function getSalesOrderById(id: number): Promise<SalesOrder> {
  const salesOrder = await findSalesOrderByIdRepo(id);

  if (!salesOrder) {
    throw new NotFoundError("Sales order is not found!");
  }

  return salesOrder;
}

export async function createSalesOrder(salesOrderData: CreateSalesOrderInput): Promise<SalesOrder> {
  if (salesOrderData.contractId && salesOrderData.customerType !== "BULOG") {
    throw new BadRequestError("Contract ID field is only applicable when customer type is BULOG!");
  }

  if (salesOrderData.customerType === "BULOG") {
    if (!salesOrderData.contractId) {
      throw new BadRequestError("Contract ID is required for BULOG orders!");
    }
    await getContractById(salesOrderData.contractId);
  }

  for (const list of salesOrderData.products) {
    const checkProductStock = await checkStockByProductIdRepo(list.warehouseId, list.productId);
    if (!checkProductStock) {
      throw new BadRequestError("Product is not found at selected warehouse. Try to look up in another warehouse!");
    }

    if (list.quantityPerKg > checkProductStock.quantityPerKg) {
      throw new BadRequestError("Insufficient stock. Try to look up in another warehouse!");
    }
  }

  return await addSalesOrderRepo(salesOrderData);
}

export async function updateSalesOrder(id: number, salesOrderData: UpdateSalesOrderInput): Promise<SalesOrder> {
  const salesOrderDetails = await getSalesOrderById(id);

  if (salesOrderDetails.status === "DELIVERED" || salesOrderDetails.status === "READY") {
    throw new BadRequestError("Sales order status is finalized and cannot be updated!");
  }

  if (salesOrderDetails.status === "PENDING" && salesOrderData.status === "READY") {
    throw new BadRequestError("Order must be processed first!");
  }

  if (salesOrderDetails.status === salesOrderData.status) {
    throw new BadRequestError(`Status is already ${salesOrderData.status}!`);
  }

  return updateSalesOrderRepo(id, salesOrderData);
}
