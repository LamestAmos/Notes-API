import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import { db } from "../db/db.js";
import { UserTable } from "../db/schema.js";
import { hashPassword } from "../lib/cryto.js";

const app = new Hono();
const registerSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8),
});
const loginSchema = z.object({
  email: z.email().min(1),
  passwordHash: z.string().min(1),
});

app.post("/register", sValidator("json", registerSchema), async (ctx) => {
  const { email, password } = ctx.req.valid("json");

  const existingUser = await db.query.UserTable.findFirst({ where: { email } });

  if (existingUser != null) {
    return ctx.json({ error: "Email already in use" }, 409);
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(UserTable)
    .values({ email, passwordHash })
    .returning({
      id: UserTable.id,
      email: UserTable.email,
      role: UserTable.role,
    });

  return ctx.json(user, 201);
});

export default app;
