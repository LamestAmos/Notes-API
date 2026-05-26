import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import type { Note } from "../types.js";

const app = new Hono();
const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

const querySchema = z.object({
  page: z.coerce.number().positive().min(1).optional(),
  limit: z.coerce.number().positive().min(1).optional(),
});

let notes: Note[] = [
  {
    id: crypto.randomUUID(),
    title: "Note 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 2",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 3",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 4",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 5",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 6",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 7",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 8",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 9",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 10",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

app.get("/", sValidator("query", querySchema), (ctx) => {
  const { page = 1, limit = 10 } = ctx.req.valid("query");

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results: {
    notes: Note[];
    next?: { page: number; limit: number };
    previous?: { page: number; limit: number };
  } = { notes: notes.slice(startIndex, endIndex) };

  if (endIndex < notes.length) {
    results.next = { page: page + 1, limit };
  }

  if (startIndex > 0) {
    results.previous = { page: page - 1, limit };
  }

  return ctx.json(results);
});

app.get("/:id", (ctx) => {
  const note = notes.find(({ id }) => id === ctx.req.param("id"));
  if (note == null) {
    return ctx.json({ error: "Note not Found" }, 404);
  }

  return ctx.json(note);
});

app.post("/", sValidator("json", createNoteSchema), (ctx) => {
  const { title, content } = ctx.req.valid("json");
  const note = { id: crypto.randomUUID(), title, content };

  notes.push(note);

  return ctx.json(note, 201);
});

app.put("/:id", sValidator("json", updateNoteSchema), (ctx) => {
  const id = ctx.req.param("id");
  const { title, content } = ctx.req.valid("json");
  const note = notes.find((n) => id === n.id);

  if (note == null) {
    return ctx.json({ error: "Note not Found" }, 404);
  }

  if (title != null) {
    note.title = title;
  }

  if (content != null) {
    note.content = content;
  }

  return ctx.json(note, 200);
});

app.delete("/:id", (ctx) => {
  const id = ctx.req.param("id");

  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex === -1) return ctx.json({ error: "Note not Found" }, 404);

  notes = notes.filter((_, i) => i !== noteIndex);

  ctx.status(204);
  return ctx.json(null);
});

export default app;
