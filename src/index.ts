import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import noteRoutes from "./routes/notes.js";
import authRoutes from "./routes/auth.js";
import groqRoutes from "./routes/groq.js";

import { env } from "./data/env.js";

const app = new Hono();

app.use(logger());

app.get("/", (ctx) => {
  return ctx.text("Notes API with CRUD Operations.");
});

app.route("/groq", groqRoutes);
app.route("/notes", noteRoutes);
app.route("/auth", authRoutes);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
