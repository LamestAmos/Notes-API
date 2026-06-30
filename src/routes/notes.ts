import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import { db } from "../db/db.js";
import { NoteTable } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { paginator } from "../middleware/paginator.js";
import { jwt } from "hono/jwt";
import { env } from "../data/env.js";
import { getUserID } from "../lib/auth.js";
import { jwtAuth, type JWTEnv } from "../middleware/auth.js";

const app = new Hono<JWTEnv>();

app.use(jwtAuth);

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

const returningNoteFields = {
  id: NoteTable.id,
  title: NoteTable.title,
  content: NoteTable.content,
  createdAt: NoteTable.createdAt,
};

app.get("/", ...paginator(), async (ctx) => {
  const userID = getUserID(ctx);

  const notes = await db.query.NoteTable.findMany({
    columns: { userID: false },
    where: { userID },
  });
  const { page = 1, limit = 10 } = ctx.req.valid("query");

  const results = ctx.var.paginate("notes", notes, page, limit);

  return ctx.json(results);
});

app.get("/:id", sValidator("param", getNoteSchema), async (ctx) => {
  const userID = getUserID(ctx);
  const note = await db.query.NoteTable.findFirst({
    where: { id: ctx.req.param("id"), userID },
    columns: { userID: false },
  });
  if (note == null) {
    return ctx.json({ error: "Note not Found" }, 404);
  }

  return ctx.json(note);
});

app.post("/", sValidator("json", createNoteSchema), async (ctx) => {
  const { title, content } = ctx.req.valid("json");
  const userID = getUserID(ctx);
  const note = { id: crypto.randomUUID(), userID, title, content };

  const [result] = await db
    .insert(NoteTable)
    .values(note)
    .returning(returningNoteFields);

  return ctx.json(result, 201);
});

app.on(
  ["PUT", "PATCH"],
  "/:id",
  sValidator("param", getNoteSchema),
  sValidator("json", updateNoteSchema),
  async (ctx) => {
    const id = ctx.req.param("id");
    const { title, content } = ctx.req.valid("json");
    const userID = getUserID(ctx);

    const [note] = await db
      .update(NoteTable)
      .set({ title, content })
      .where(and(eq(NoteTable.id, id), eq(NoteTable.userID, userID)))
      .returning(returningNoteFields);

    return ctx.json(note);
  },
);

app.delete("/:id", sValidator("param", getNoteSchema), async (ctx) => {
  const id = ctx.req.param("id");
  const userID = getUserID(ctx);

  const [result] = await db
    .delete(NoteTable)
    .where(and(eq(NoteTable.id, id), eq(NoteTable.userID, userID)))
    .returning();
  if (result == null) return ctx.json({ error: "Note not Found" }, 404);

  ctx.status(204);
  return ctx.json(null);
});

export default app;
