import { prisma } from "../config/database";
import { Delivery } from "@prisma/client";

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
