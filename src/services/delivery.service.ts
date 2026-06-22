import { Delivery } from "@prisma/client";
import { addDeliveryRepo, findAllDeliveriesRepo, findDeliveryByIdRepo, findDeliveryBySalesOrderIdRepo, updateDeliveryRepo } from "../repositories/delivery.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateDeliveryInput, UpdateDeliveryInput } from "../validators/delivery.validator";
import { getSalesOrderById } from "./salesOrder.service";
import { findById } from "../repositories/user.repository";
import { checkVehicleBeingUsed, getVehicleById } from "./vehicle.service";
import { updateSalesOrderRepo } from "../repositories/salesOrder.repository";
import { contractQueue } from "../jobs/queues/contract.queue";

export async function getAllDeliveries(): Promise<Delivery[]> {
  return findAllDeliveriesRepo();
}

export async function getDeliveryById(id: number): Promise<Delivery> {
  const deliveryData = await findDeliveryByIdRepo(id);

  if (!deliveryData) {
    throw new NotFoundError("Delivery is not found!");
  }

  return deliveryData;
}

export async function createDelivery(deliveryData: CreateDeliveryInput): Promise<Delivery> {
  const salesOrderHasDelivery = await findDeliveryBySalesOrderIdRepo(deliveryData.salesOrderId);

  if (salesOrderHasDelivery) {
    throw new BadRequestError("Sales order already has delivery!");
  }

  const foundedSalesOrderId = await getSalesOrderById(deliveryData.salesOrderId);

  if (foundedSalesOrderId.status !== "READY") {
    throw new BadRequestError("Unable to deliver order when status is not READY!");
  }

  const user = await findById(deliveryData.driverId);

  if (!user) {
    throw new NotFoundError("Driver is not found!");
  }

  if (user.role !== "DRIVER") {
    throw new BadRequestError("User assigned is not a DRIVER. please select another user ID!");
  }

  const vehiclePlan = await getVehicleById(deliveryData.vehicleId);

  if (!vehiclePlan.isAvailable) {
    throw new BadRequestError("Vehicle is not available!");
  }

  await checkVehicleBeingUsed(deliveryData.vehicleId);

  const totalWeight = foundedSalesOrderId.salesOrderProducts.reduce((acc, cur) => {
    return acc + cur.quantityPerKg;
  }, 0);

  if (totalWeight > vehiclePlan.capacityPerKg) {
    throw new BadRequestError("Total order weight exceeds vehicle capacity!");
  }

  return addDeliveryRepo(deliveryData);
}

export async function updateDelivery(id: number, deliveryData: UpdateDeliveryInput): Promise<Delivery> {
  const existedDeliveryData = await getDeliveryById(id);

  if (existedDeliveryData.status === "DELIVERED") {
    throw new BadRequestError("Delivery is delivered and cannot be updated!");
  }

  if (existedDeliveryData.status === "PENDING") {
    if (deliveryData.status === "DELIVERED") {
      throw new BadRequestError("Delivery cannot be updated to DELIVERED without DISPATCHED!");
    }
    return updateDeliveryRepo(id, {
      ...deliveryData,
      departureTime: new Date(),
    });
  }

  if (existedDeliveryData.status === "DISPATCHED") {
    if (deliveryData.status === "DISPATCHED") {
      throw new BadRequestError("Status is already DISPATCHED!");
    }
  }

  await updateSalesOrderRepo(existedDeliveryData.salesOrderId, { status: "DELIVERED" });

  await contractQueue.add("fulfillment", { salesOrderId: existedDeliveryData.salesOrderId });

  return updateDeliveryRepo(id, {
    ...deliveryData,
    arrivalTime: new Date(),
  });
}
