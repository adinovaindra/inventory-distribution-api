import { MillingJob, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginationQuery } from "../utils/pagination";

export async function findAllMillingJobsRepo(paginationQuery: PaginationQuery): Promise<MillingJob[]> {
  return prisma.millingJob.findMany({
    ...paginationQuery,
  });
}

export async function findMillingJobByIdRepo(id: number): Promise<MillingJob | null> {
  return prisma.millingJob.findUnique({
    where: {
      id,
    },
  });
}

export async function findInProgressMillingJobStatusRepo(): Promise<MillingJob | null> {
  return prisma.millingJob.findFirst({
    where: {
      status: { equals: "IN_PROGRESS" },
    },
  });
}

export async function addMillingJobRepo(millingJobData: Prisma.MillingJobCreateInput): Promise<MillingJob> {
  return prisma.millingJob.create({
    data: millingJobData,
  });
}

export async function updateMillingJobRepo(id: number, millingJobData: Prisma.MillingJobUpdateInput): Promise<MillingJob> {
  return prisma.millingJob.update({
    where: {
      id,
    },
    data: millingJobData,
  });
}
