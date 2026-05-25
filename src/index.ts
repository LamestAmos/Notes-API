import express, { type Request, type Response } from "express";
import logger from "./middleware/logger.js";

const app = express();
const PORT = 3000;

const notes = [{ id: 1 }];

// middleware
app.use(express.json());
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.send("Notes API with full CRUD operations. ");
});

app.get("/notes/", (req: Request, res: Response) => {
  res.send(JSON.stringify(notes));
});

app.get("/notes/:id", (req: Request, res: Response) => {
  const noteID = req.params.id; // typed as string
  res.json({ id: noteID });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
