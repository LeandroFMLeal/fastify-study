import crypto from "crypto";
import { string } from "zod";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return { hash, salt };
}

interface iVerifyPassword {
  candidatePassword: string;
  salt: string;
  hash: string;
}

export function verifyPassword({
  candidatePassword,
  salt,
  hash,
}: iVerifyPassword) {
  const candidateHash = crypto
    .pbkdf2Sync(candidatePassword, salt, 1000, 64, "sha512")
    .toString("hex");
  return candidateHash === hash;
}
