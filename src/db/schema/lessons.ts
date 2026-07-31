import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";

// A "tekst": the reading text itself (poem, news article, ...) plus its analysis.
// Content lives in the DB as text, not as stored PDF files - PDFs are only ever
// transient: imported to fill these fields, or generated on export.
export const teksten = pgTable("teksten", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  group: text("group").notNull(), // e.g. "Groep 5"
  genre: text("genre").notNull(),
  theme: text("theme"),
  imageUrl: text("image_url"),
  textContent: text("text_content").notNull().default(""),
  textAnalysisContent: text("text_analysis_content").notNull().default(""),
  isFree: boolean("is_free").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// A lesson (e.g. "3V-leesroutine") built around a tekst. One tekst can have many lessons,
// but each lesson belongs to exactly one tekst - a plain foreign key, no join table needed.
export const lessen = pgTable("lessen", {
  id: serial("id").primaryKey(),
  tekstId: integer("tekst_id")
    .notNull()
    .references(() => teksten.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
