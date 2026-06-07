import { NextFunction, Request, Response } from "express";
import { BaseError } from "../utils/error";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed!",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
