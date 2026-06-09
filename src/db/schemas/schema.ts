import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const NoteTable = pgTable("notes", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
