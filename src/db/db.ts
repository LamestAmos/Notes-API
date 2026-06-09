import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../data/env.js";
import { relations } from "./relations.js";
export const db = drizzle({
  relations,
  connection: {
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    user: env.DB_USER,
    host: env.DB_HOST,
    port: env.DB_PORT,
  },
});
