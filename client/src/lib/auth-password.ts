import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPasswords(password: string, hashedPassword: string) {
  if (!password || !hashedPassword) {
    return false
  }

  return await compare(password, hashedPassword);
}
