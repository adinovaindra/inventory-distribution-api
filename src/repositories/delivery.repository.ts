import { prisma } from "../config/database";
import { Delivery, Prisma } from "@prisma/client";
import { CreateDeliveryInput, UpdateDeliveryInput } from "../validators/delivery.validator";
import { PaginationQuery } from "../utils/pagination";

export async function findActiveDeliveryByVehicleIdRepo(vehicleId: number): Promise<Delivery | null> {
  return prisma.delivery.findFirst({
    where: {
      vehicleId,
      status: { not: "DELIVERED" },
    },
  });
}

export async function findDeliveryByVehicleIdRepo(vehicleId: number): Promise<Delivery | null> {
  return prisma.delivery.findFirst({
    where: {
      vehicleId,
    },
  });
}

export async function findDeliveryBySalesOrderIdRepo(salesOrderId: number): Promise<Delivery | null> {
  return prisma.delivery.findFirst({
    where: {
      salesOrderId,
    },
  });
}

export async function findAllDeliveriesRepo(paginationQuery: PaginationQuery): Promise<Delivery[]> {
  return prisma.delivery.findMany({
    ...paginationQuery,
  });
}

export async function findDeliveryByIdRepo(id: number): Promise<Delivery | null> {
  return prisma.delivery.findUnique({
    where: {
      id,
    },
  });
}

export async function addDeliveryRepo(deliveryData: CreateDeliveryInput): Promise<Delivery> {
  return prisma.delivery.create({
    data: {
      ...deliveryData,
      status: "PENDING",
    },
  });
}

export async function updateDeliveryRepo(id: number, deliveryData: Prisma.DeliveryUncheckedUpdateInput): Promise<Delivery> {
  return prisma.delivery.update({
    where: {
      id,
    },
    data: deliveryData,
  });
}
