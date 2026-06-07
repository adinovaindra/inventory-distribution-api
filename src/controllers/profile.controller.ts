import { Request, Response } from "express";
import { getProfileById } from "../services/profile.service";
import { successResponse } from "../utils/response";

export async function getProfile(req: Request, res: Response) {
  const id = Number(req.params.id);
  const selectedUser = await getProfileById(id);

  res.status(200).json(successResponse("User is found!", selectedUser));
}
