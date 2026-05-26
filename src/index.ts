import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import noteRoutes from "./routes/notes.js";

const app = new Hono();

app.use(logger());

app.get("/", (ctx) => {
  return ctx.text("Notes API with CRUD Operations.");
});

app.route("/notes", noteRoutes);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
