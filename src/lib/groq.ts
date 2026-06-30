import Groq from "groq-sdk";
import { env } from "../data/env.js";
import type { Note } from "../types.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function getNoteSummary(note: Note) {
  const chatCompletion = await getGroqNoteCompletion(note);
  return chatCompletion.choices[0]?.message?.content || "";
}

export async function getGroqNoteCompletion(note: Note) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Summarize the following note in a single paragraph max. Title: ${note.title}. Content: ${note.content}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
