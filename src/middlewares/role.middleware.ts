import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/error";
import { UserRole } from "@prisma/client";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized!");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        "You don't have permission to access this resource!",
      );
    }

    next();
  };
}

export function authorizeSelfOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    throw new UnauthorizedError("Unauthorized!");
  }

  const isOwner =  req.user.userId === Number(req.params.id)
  const isAdmin = req.user.role === UserRole.ADMIN

  if(!isOwner && !isAdmin) {
    throw new ForbiddenError("You can only access your own profile or your role must be an admin!")
  }

  next()
}
