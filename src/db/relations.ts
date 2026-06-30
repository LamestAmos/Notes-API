import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js";

export const relations = defineRelations(schema, (r) => ({
  UserTable: {
    notes: r.many.NoteTable(),
  },
  NoteTable: {
    user: r.one.UserTable({
      from: r.NoteTable.userID,
      to: r.UserTable.id,
    }),
  },
}));
