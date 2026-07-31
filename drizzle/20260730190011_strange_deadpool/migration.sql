CREATE TABLE "lessen" (
	"id" serial PRIMARY KEY,
	"tekst_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teksten" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"group" text NOT NULL,
	"genre" text NOT NULL,
	"theme" text,
	"image_url" text,
	"text_content" text DEFAULT '' NOT NULL,
	"text_analysis_content" text DEFAULT '' NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "lessons";--> statement-breakpoint
ALTER TABLE "lessen" ADD CONSTRAINT "lessen_tekst_id_teksten_id_fkey" FOREIGN KEY ("tekst_id") REFERENCES "teksten"("id") ON DELETE CASCADE;