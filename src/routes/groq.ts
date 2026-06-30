import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { db } from "../db/db.js";
import { getNoteSummary } from "../lib/groq.js";
import z from "zod";
import { RateLimitError } from "groq-sdk";
import { getUserID } from "../lib/auth.js";
import { jwtAuth, type JWTEnv } from "../middleware/auth.js";

const app = new Hono<JWTEnv>();
app.use(jwtAuth);

const getNoteSchema = z.object({
  id: z.uuid(),
});

app.get("/", (ctx) => {
  return ctx.text("Make a note summary with the Groq API");
});

app.get("/:id", sValidator("param", getNoteSchema), async (ctx) => {
  const userID = getUserID(ctx);
  const note = await db.query.NoteTable.findFirst({
    where: { id: ctx.req.param("id"), userID },
  });
  if (note == null) {
    return ctx.json({ error: "Note not Found" }, 404);
  }
  try {
    const summary = await getNoteSummary(note);
    return ctx.text(summary);
  } catch (err: any) {
    if (err instanceof RateLimitError) {
      return ctx.json({ "Retry-After": err.headers.get("retry-after") }, 429);
    }
    return ctx.json({ ...err });
  }
});

export default app;
