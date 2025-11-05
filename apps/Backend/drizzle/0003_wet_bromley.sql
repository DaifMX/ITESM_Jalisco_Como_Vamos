CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "answers_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" numeric NOT NULL,
	CONSTRAINT "results_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "segments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "segments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "segmentValues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"segmentId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "segmentValues_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "question" TO "value";--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "category_id" TO "categoryId";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "questions" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questionData" ADD COLUMN "resultId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "questionData" ALTER COLUMN "answerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questionData" ALTER COLUMN "questionId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questionData" ALTER COLUMN "segmentValueId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questionData" DROP CONSTRAINT "questionData_pkey";--> statement-breakpoint
ALTER TABLE "questionData" ADD CONSTRAINT "questionData_answerId_questionId_resultId_segmentValueId_pk" PRIMARY KEY("answerId","questionId","resultId","segmentValueId");--> statement-breakpoint
ALTER TABLE "questionData" ADD CONSTRAINT "questionData_answerId_answers_id_fk" FOREIGN KEY ("answerId") REFERENCES "public"."answers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionData" ADD CONSTRAINT "questionData_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionData" ADD CONSTRAINT "questionData_resultId_results_id_fk" FOREIGN KEY ("resultId") REFERENCES "public"."results"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionData" ADD CONSTRAINT "questionData_segmentValueId_segmentValues_id_fk" FOREIGN KEY ("segmentValueId") REFERENCES "public"."segmentValues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionData" DROP COLUMN "id";