export type Note = {
  id: string;
  title: string;
  content: string;
};

export type CreateNoteQuery = Omit<Note, "id">;
