import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import logger from "./middleware/logger.js";
import type { CreatNoteQuery, Note } from "./types.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = 3000;

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
];

// middleware
app.use(express.json());
app.use(logger);
app.use(errorHandler);

// GET Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Notes API with full CRUD operations. ");
});

app.get("/notes/", (req: Request, res: Response) => {
  res.status(200).send(JSON.stringify(notes));
});

app.get("/notes/:id", (req, res: Response) => {
  const noteID = req.params.id;
  const note = notes.find(({ id }) => id === noteID);
  if (note == null) {
    return res.status(404).json({ message: "Note not Found" });
  }
  res.status(200).json(note);
});

// POST Route
app.post(
  "/notes",
  (req: Request<{}, {}, CreatNoteQuery>, res: Response, next: NextFunction) => {
    try {
      const { title, content } = req.body;
      const newNote = {
        id: crypto.randomUUID(),
        title,
        content,
      };
      notes.push(newNote);
      res.status(201).json(newNote);
    } catch (error: any) {
      next({ ...error, status: 400, message: "Invalid JSON" });
    }
  },
);

// PUT Route
app.put(
  "/notes:id",
  (
    req: Request<{ id: string }, {}, CreatNoteQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const noteID = req.params.id;
      const note = notes.find(({ id }) => id === noteID);
      if (note == null) {
        return res.status(404).json({ message: "Note not found" });
      }

      note.title = req.body.title;
      note.content = req.body.content;

      res.status(200).json(note);
    } catch (error: any) {
      next({ ...error, status: 400, message: "Invalid JSON" });
    }
  },
);

// PATCH Route
app.patch(
  "/notes:id",
  (
    req: Request<{ id: string }, {}, Partial<CreatNoteQuery>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const noteID = req.params.id;
      let note = notes.find(({ id }) => id === noteID);
      if (note == null) {
        return res.status(404).json({ message: "Note not found" });
      }

      note = { ...note, ...req.body };

      res.status(200).json(note);
    } catch (error: any) {
      next({ ...error, status: 400, message: "Invalid JSON" });
    }
  },
);

// DELETE Route
app.delete("/notes:id", (req, res: Response) => {
  const noteID = req.params.id;
  const note = notes.find(({ id }) => id === noteID);
  if (note == null) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes = notes.filter(({ id }) => id !== note.id);

  res.status(204).json(note);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
