import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

// A "rijke tekst" lesson: content lives in the DB as text, not as stored PDF files.
// PDFs are only ever transient - imported to fill these fields, or generated on export.
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  group: text("group").notNull(), // e.g. "Groep 5"
  genre: text("genre").notNull(),
  theme: text("theme"),
  imageUrl: text("image_url"),
  textContent: text("text_content").notNull().default(""),
  textAnalysisContent: text("text_analysis_content").notNull().default(""),
  lessonContent: text("lesson_content").notNull().default(""),
  isFree: boolean("is_free").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
