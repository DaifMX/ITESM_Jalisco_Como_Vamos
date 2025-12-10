ALTER TABLE "questions" ALTER COLUMN "value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "valueShort" text;