import { Request, Response } from "express";
import { createMillingJob, getAllMillingJobs, getMillingJobById, updateMillingJob } from "../services/millingJobs.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { createMillingJobSchema, updateMillingJobSchema } from "../validators/millingJobs.validator";
import { paginationSchema } from "../utils/pagination";

export async function getAllMillingJobsController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllMillingJobs(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all milling jobs!", data, meta));
}

export async function getMillingJobByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await getMillingJobById(id);
  res.status(200).json(successResponse("Milling job is found!", result));
}

export async function createMillingJobController(req: Request, res: Response) {
  const millingJobData = createMillingJobSchema.parse(req.body);
  const result = await createMillingJob(millingJobData);
  res.status(201).json(successResponse("Milling job is successfully created!", result));
}

export async function updateMillingJobController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const millingJobData = updateMillingJobSchema.parse(req.body);
  const result = await updateMillingJob(id, millingJobData);
  res.status(200).json(successResponse(`Milling job status is successfully updated to ${result.status}`, result));
}
