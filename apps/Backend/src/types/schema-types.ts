import type { questions, answers, questionData } from "@/db/schema";

export type QuestionNew = typeof questions.$inferInsert;
export type AnswerNew = typeof answers.$inferInsert;
export type QuestionDataNew = typeof questionData.$inferInsert;