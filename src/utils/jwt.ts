import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";

export interface JwtPayLoad {
  userId: number;
  role: UserRole;
}

export function signToken(payload: JwtPayLoad): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtPayLoad {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayLoad
}
