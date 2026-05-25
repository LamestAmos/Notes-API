export type Note = {
  id: string;
  title: string;
  content: string;
};

export type CreatNoteQuery = Omit<Note, "id">;
