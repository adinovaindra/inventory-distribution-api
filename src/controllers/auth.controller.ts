import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginUser, registerUser } from "../services/auth.service";
import { successResponse } from "../utils/response";

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const result = await registerUser(data);
  res.status(201).json(successResponse("User created!", result));
}

export async function login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body)
    const result = await loginUser(data)
    res.status(200).json(successResponse("User logged in!", result))
}