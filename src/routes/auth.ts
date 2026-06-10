import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import { db } from "../db/db.js";
import { UserTable } from "../db/schema.js";
import { hashPassword, verifyPassword } from "../lib/cryto.js";
import { sign } from "hono/jwt";
import { env } from "../data/env.js";

const DEFAULT_JWT_EXPIRATION_TIME = 5 * 60; // 5 mins

const app = new Hono();
const registerSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8),
});
const loginSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(1),
});

app.post("/login", sValidator("json", loginSchema), async (ctx) => {
  const { email, password } = ctx.req.valid("json");

  const user = await db.query.UserTable.findFirst({ where: { email } });

  if (user == null) {
    return ctx.json({ error: "Invalid Email or Password" }, 401);
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return ctx.json({ error: "Invalid Email or Password" }, 401);
  }

  const now = Math.floor(Date.now() / 1000);

  const token = await sign(
    {
      exp: now + DEFAULT_JWT_EXPIRATION_TIME,
      sub: user.id,
      email: user.email,
    },
    env.JWT_SECRET,
  );

  return ctx.json({ token });
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
