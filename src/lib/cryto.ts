import { randomBytes, scrypt } from "node:crypto";

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt);

  return `${salt}:${hash}`;
}

async function scryptAsync(password: string, salt: string) {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey);
    });
  });
}
