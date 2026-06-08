import bcrypt from "bcryptjs";
import { createUser, findByEmail } from "../repositories/user.repository";
import { BadRequestError, UnauthorizedError } from "../utils/error";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
import { Prisma } from "@prisma/client";
import { signToken } from "../utils/jwt";
import redis from "../config/redis";
import jwt from "jsonwebtoken";

export async function registerUser(data: RegisterInput) {
  const user = await findByEmail(data.email);
  if (user) {
    throw new BadRequestError("Email already registered!");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const createdUser = await createUser({ ...data, password: hashedPassword });
    const { password: _password, ...safeUser } = createdUser;
    return safeUser;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new BadRequestError("Email already registered!");
    }
    throw error;
  }
}

export async function loginUser(data: LoginInput) {
  const registeredUser = await findByEmail(data.email);

  if (!registeredUser) {
    throw new UnauthorizedError("Email or password is invalid");
  }

  const isMatch = await bcrypt.compare(data.password, registeredUser.password);

  if (!isMatch) {
    throw new UnauthorizedError("Email or password is invalid");
  }

  const payload = {
    userId: registeredUser.id,
    role: registeredUser.role,
  };

  return {
    token: signToken(payload),
  };
}

export async function logoutUser(token: string) {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === "string" || !decoded.exp) {
    throw new UnauthorizedError("Invalid Token!");
  }

  const ttlInSeconds = decoded.exp - Math.floor(Date.now() / 1000);

  return redis.set(`blacklist:${token}`, "1", "EX", ttlInSeconds);
}
