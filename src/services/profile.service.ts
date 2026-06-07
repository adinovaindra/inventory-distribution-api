import { findById } from "../repositories/user.repository";
import { NotFoundError } from "../utils/error";

export async function getProfileById(id: number) {
  const profile = await findById(id);

  if (!profile) {
    throw new NotFoundError("User not found!");
  }

  const { password: _password, ...safeUser } = profile;
  return safeUser;
}
