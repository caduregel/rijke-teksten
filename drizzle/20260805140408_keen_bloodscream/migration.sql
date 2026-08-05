CREATE TABLE "rate_limit" (
	"id" text PRIMARY KEY,
	"key" text NOT NULL,
	"count" integer,
	"last_request" bigint
);
