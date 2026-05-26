import { Hono } from "hono";

const app = new Hono();

let notes = [
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

app.get("/", (ctx) => {
  return ctx.json(notes);
});

app.get("/:id", (ctx) => {
  const note = notes.find(({ id }) => id === ctx.req.param("id"));
  if (note == null) {
    return ctx.json({ error: "Note not Found" }, 404);
  }

  return ctx.json(note);
});

export default app;
