import { MillingJob, MillingJobStatus } from "@prisma/client";
import { addMillingJobRepo, findAllMillingJobsRepo, findInProgressMillingJobStatusRepo, findMillingJobByIdRepo, updateMillingJobRepo } from "../repositories/millingJobs.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateMillingJobInput, UpdateMillingJobInput } from "../validators/millingJobs.validator";
import { buildPaginationMeta, buildPaginationQuery } from "../utils/pagination";

export async function getAllMillingJobs(cursor: number | undefined, limit: number) {
  const paginationQuery = buildPaginationQuery(cursor, limit);
  const allMilingJobs = await findAllMillingJobsRepo(paginationQuery);
  const paginationMeta = buildPaginationMeta(allMilingJobs, limit);
  return {
    data: allMilingJobs,
    meta: paginationMeta,
  };
}

export async function getMillingJobById(id: number): Promise<MillingJob> {
  const millingJob = await findMillingJobByIdRepo(id);

  if (!millingJob) {
    throw new NotFoundError("Milling Job is not found!");
  }

  return millingJob;
}

export async function createMillingJob(millingJobData: CreateMillingJobInput): Promise<MillingJob> {
  const inProgress = await findInProgressMillingJobStatusRepo();

  if (inProgress) {
    return addMillingJobRepo({
      ...millingJobData,
      status: MillingJobStatus.PENDING,
    });
  }
  return addMillingJobRepo({
    ...millingJobData,
    status: MillingJobStatus.IN_PROGRESS,
  });
}

export async function updateMillingJob(id: number, millingJobData: UpdateMillingJobInput): Promise<MillingJob> {
  const { status, ...restMillingJobData } = millingJobData;

  const foundedMillingJob = await getMillingJobById(id);

  const { inputWeightPerKg: input } = foundedMillingJob;

  if (foundedMillingJob.status === "CANCELLED" || foundedMillingJob.status === "COMPLETED") {
    throw new BadRequestError("Milling Job is already finalized and cannot be updated!");
  } else if (foundedMillingJob.status === "IN_PROGRESS") {
    if (millingJobData.status === "PENDING") {
      throw new BadRequestError("Unable to change the status into PENDING!");
    } else if (millingJobData.status === "CANCELLED") {
      throw new BadRequestError("Milling job cannot be cancelled!");
    } else if (millingJobData.status === "IN_PROGRESS") {
      throw new BadRequestError("Status already IN PROGRESS!");
    }
  } else if (foundedMillingJob.status === "PENDING") {
    if (millingJobData.status === "COMPLETED") {
      throw new BadRequestError("Unable jump to COMPLETED when Milling Job is never executed!");
    } else if (millingJobData.status === "PENDING") {
      throw new BadRequestError("Status already PENDING!");
    }
  }

  if (millingJobData.status === "COMPLETED") {
    const { outputUtuhPerKg: utuh, outputBrokenPerKg: broken, outputMenirPerKg: menir, outputRejectPerKg: reject, outputKatulPerKg: katul } = restMillingJobData;

    if (!utuh || !broken || !menir || !reject || !katul) {
      throw new BadRequestError("All output fields are required when completing a milling jobs!");
    }
    const totalOutput = utuh + broken + menir + reject + katul;
    if (totalOutput > input) {
      throw new BadRequestError("Total output cannot exceed input weight!");
    }
    const susutPerKg = input - totalOutput;
    return updateMillingJobRepo(id, {
      status,
      ...restMillingJobData,
      susutPerKg,
    });
  }

  return updateMillingJobRepo(id, {
    status,
  });
}
