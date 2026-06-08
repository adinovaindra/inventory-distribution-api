import { User, Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({
    data,
  });
}

export async function findById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function updateUser(
  id: number,
  data: Prisma.UserUpdateInput,
): Promise<User> {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteUser(id: number): Promise<User> {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}
