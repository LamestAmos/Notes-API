import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import { db } from "../db/db.js";
import { NoteTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { paginator } from "../middleware/paginator.js";

const app = new Hono();

const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

const getNoteSchema = z.object({
  id: z.uuid(),
});

app.get("/", ...paginator(), async (ctx) => {
  const notes = await db.query.NoteTable.findMany();
  const { page = 1, limit = 10 } = ctx.req.valid("query");

  const results = ctx.var.paginate(notes, page, limit);

  return ctx.json(results);
});

app.get("/:id", sValidator("param", getNoteSchema), async (ctx) => {
  const note = await db.query.NoteTable.findFirst({
    where: { id: ctx.req.param("id") },
  });
  if (note == null) {
    return ctx.json({ error: "Note not Found" }, 404);
  }

  return ctx.json(note);
});

app.post("/", sValidator("json", createNoteSchema), async (ctx) => {
  const { title, content } = ctx.req.valid("json");
  const note = { id: crypto.randomUUID(), title, content };

  const [result] = await db.insert(NoteTable).values(note).returning();

  return ctx.json(result, 201);
});

app.on(
  ["PUT", "PATCH"],
  "/:id",
  sValidator("json", updateNoteSchema),
  async (ctx) => {
    const id = ctx.req.param("id");
    const { title, content } = ctx.req.valid("json");

    const [note] = await db
      .update(NoteTable)
      .set({ title, content })
      .where(eq(NoteTable.id, id))
      .returning();

    return ctx.json(note);
  },
);

app.delete("/:id", sValidator("param", getNoteSchema), async (ctx) => {
  const id = ctx.req.param("id");

  const [result] = await db
    .delete(NoteTable)
    .where(eq(NoteTable.id, id))
    .returning();
  if (result == null) return ctx.json({ error: "Note not Found" }, 404);

  ctx.status(204);
  return ctx.json(null);
});

export default app;
