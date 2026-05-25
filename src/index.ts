import express, { type Request, type Response } from "express";
import logger from "./middleware/logger.js";
import type { Note } from "./types.js";

const app = express();
const PORT = 3000;

const notes: Note[] = [
  {
    id: crypto.randomUUID(),
    title: "Note 1",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: crypto.randomUUID(),
    title: "Note 2",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

// middleware
app.use(express.json());
app.use(logger);

// GET Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Notes API with full CRUD operations. ");
});

app.get("/notes/", (req: Request, res: Response) => {
  res.send(JSON.stringify(notes));
});

app.get("/notes/:id", (req: Request, res: Response) => {
  const noteID = req.params.id; // typed as string
  const note = notes.find(({ id }) => id === noteID);
  if (note == null) {
    res.status(404).json({ message: "Note not Found" });
    return;
  }
  res.status(200).json(note);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
