import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt);

  return `${salt}:${hash.toString("hex")}`;
}

async function scryptAsync(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey);
    });
  });
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hashHex] = storedHash.split(":");
  const stored = Buffer.from(hashHex, "hex");
  const derived = await scryptAsync(password, salt);
  return timingSafeEqual(stored, derived);
}
