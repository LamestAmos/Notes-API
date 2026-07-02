import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./users.js";

export const NoteTable = pgTable("notes", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  userID: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  groqSummary: text(),
});
