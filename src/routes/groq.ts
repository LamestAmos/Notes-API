import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { db } from "../db/db.js";
import { getNoteSummary } from "../lib/groq.js";
import z from "zod";
import { RateLimitError } from "groq-sdk";
import { getUserID } from "../lib/auth.js";
import { jwtAuth, type JWTEnv } from "../middleware/auth.js";
import { NoteTable } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

const app = new Hono<JWTEnv>();
app.use(jwtAuth);

const getNoteSchema = z.object({
  id: z.uuid(),
});
const groqSummarySchema = z.object({
  new: z.coerce.boolean().optional(),
});

app.get("/", (ctx) => {
  return ctx.text("Make a note summary with the Groq API");
});

app.get(
  "/:id",
  sValidator("param", getNoteSchema),
  sValidator("query", groqSummarySchema),
  async (ctx) => {
    const userID = getUserID(ctx);
    const id = ctx.req.param("id");
    const { new: newSummary } = ctx.req.valid("query");
    const note = await db.query.NoteTable.findFirst({
      where: { id, userID },
    });

    if (note == null) {
      return ctx.json({ error: "Note not Found" }, 404);
    }

    if (note.groqSummary && !newSummary) {
      return ctx.text(note.groqSummary);
    }

    try {
      const summary = await getNoteSummary(note);

      await db
        .update(NoteTable)
        .set({ groqSummary: summary })
        .where(and(eq(NoteTable.id, id), eq(NoteTable.userID, userID)));

      return ctx.text(summary);
    } catch (err: any) {
      if (err instanceof RateLimitError) {
        return ctx.json({ "Retry-After": err.headers.get("retry-after") }, 429);
      }
      return ctx.json({ ...err });
    }
  },
);

export default app;
