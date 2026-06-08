import {
  deleteUser,
  findById,
  updateUser,
} from "../repositories/user.repository";
import { NotFoundError } from "../utils/error";
import { UpdateProfileInput } from "../validators/profile.validator";
import bcrypt from "bcryptjs";

async function findUserById(id: number) {
  const user = await findById(id);

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  return user;
}

export async function getProfileById(id: number) {
  const profile = await findUserById(id);

  const { password: _password, ...safeUser } = profile;
  return safeUser;
}

export async function updateProfileById(id: number, data: UpdateProfileInput) {
  await findUserById(id);

  const updateData = { ...data };
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const updatedUser = await updateUser(id, updateData);
  const { password: _password, ...safeUser } = updatedUser;
  return safeUser;
}

export async function deleteProfileById(id: number) {
  await findUserById(id);

  const deletedUser = await deleteUser(id);

  const { password: _password, ...safeUser } = deletedUser;

  return safeUser;
}
