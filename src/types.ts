import type { NoteTable } from "./db/schema.js";

export type Note = typeof NoteTable.$inferSelect;

export type CreateNoteQuery = Omit<Note, "id">;
