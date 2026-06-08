import { Request, Response } from "express";
import {
  deleteProfileById,
  getProfileById,
  updateProfileById,
} from "../services/profile.service";
import { successResponse } from "../utils/response";
import { updateProfileSchema } from "../validators/profile.validator";

export async function getProfile(req: Request, res: Response) {
  const id = Number(req.params.id);
  const selectedUser = await getProfileById(id);

  res.status(200).json(successResponse("User is found!", selectedUser));
}

export async function updateProfile(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = updateProfileSchema.parse(req.body);
  const updatedUser = await updateProfileById(id, data);
  res
    .status(200)
    .json(successResponse("Profile is successfully updated!", updatedUser));
}

export async function deleteProfile(req: Request, res: Response) {
  const id = Number(req.params.id);
  const userDeleted = await deleteProfileById(id);
  res
    .status(200)
    .json(successResponse("Profile is successfully deleted!", userDeleted));
}
