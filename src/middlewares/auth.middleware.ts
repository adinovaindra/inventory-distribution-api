import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/error";
import { verifyToken } from "../utils/jwt";
import redis from "../config/redis";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Token is invalid!");
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    throw new UnauthorizedError("Token has been revoked!");
  }

  next();
}
