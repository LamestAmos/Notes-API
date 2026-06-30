import type { NoteTable } from "./db/schema.js";

export type Note = typeof NoteTable.$inferSelect;

export type JWTPayload = {
  sub: string;
  email: string;
  role: "user" | "admin";
  exp: number;
};

export type CreateNoteQuery = Omit<Note, "id">;
