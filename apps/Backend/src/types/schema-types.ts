import type { questions, answers, questionData, categories } from "@/db/schema";

export type AnswerNew = typeof answers.$inferInsert;
export type CategoryNew = typeof categories.$inferInsert;
export type QuestionNew = typeof questions.$inferInsert;
export type QuestionDataNew = typeof questionData.$inferInsert;