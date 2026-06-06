import bcrypt from "bcryptjs";
import { createUser, findByEmail } from "../repositories/user.repository";
import { BadRequestError } from "../utils/error";
import { RegisterInput } from "../validators/auth.validator";
import { Prisma } from "@prisma/client";

export async function registerUser(data: RegisterInput) {
  const user = await findByEmail(data.email);
  if (user) {
    throw new BadRequestError("Email already registered!");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const createdUser = await createUser({ ...data, password: hashedPassword });
    const {password: _password, ...safeUser} = createdUser
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
