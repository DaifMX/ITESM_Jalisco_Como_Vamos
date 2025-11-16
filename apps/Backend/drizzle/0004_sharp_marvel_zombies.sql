ALTER TABLE "questionData" DROP CONSTRAINT "questionData_answerId_questionId_resultId_segmentValueId_pk";--> statement-breakpoint
ALTER TABLE "questionData" DROP CONSTRAINT "questionData_resultId_results_id_fk";--> statement-breakpoint

ALTER TABLE "results" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "results" CASCADE;--> statement-breakpoint

ALTER TABLE "questionData" ADD CONSTRAINT "questionData_answerId_questionId_segmentValueId_pk" PRIMARY KEY("answerId","questionId","segmentValueId");--> statement-breakpoint
ALTER TABLE "questionData" ADD COLUMN "result" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "questionData" DROP COLUMN "resultId";