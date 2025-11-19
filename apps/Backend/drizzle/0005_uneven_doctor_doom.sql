ALTER TABLE "questions" ALTER COLUMN "xlsxCode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "categoryId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "segmentValues" ADD CONSTRAINT "segmentValues_segmentId_segments_id_fk" FOREIGN KEY ("segmentId") REFERENCES "public"."segments"("id") ON DELETE no action ON UPDATE no action;