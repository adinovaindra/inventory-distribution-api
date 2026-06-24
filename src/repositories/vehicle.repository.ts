import { Prisma, Vehicle } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginationQuery } from "../utils/pagination";

export async function findAllVehiclesRepo(paginationQuery: PaginationQuery): Promise<Vehicle[]> {
  return prisma.vehicle.findMany({
    ...paginationQuery,
  });
}

export async function findVehicleByIdRepo(id: number): Promise<Vehicle | null> {
  return prisma.vehicle.findUnique({
    where: {
      id,
    },
  });
}

export async function addVehicleRepo(vehicleData: Prisma.VehicleCreateInput): Promise<Vehicle> {
  return prisma.vehicle.create({
    data: vehicleData,
  });
}

export async function updateVehicleRepo(id: number, vehicleData: Prisma.VehicleUpdateInput): Promise<Vehicle> {
  return prisma.vehicle.update({
    where: {
      id,
    },
    data: vehicleData,
  });
}

export async function deleteVehicleRepo(id: number): Promise<Vehicle> {
  return prisma.vehicle.delete({
    where: {
      id,
    },
  });
}
