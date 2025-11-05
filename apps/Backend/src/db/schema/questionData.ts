import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

import { answers, questions, results, segmentValues } from "@/db/schema";

export const questionData = pgTable(
    'questionData',
    {
        answerId: uuid('answerId').notNull().references(() => answers.id),
        questionId: uuid('questionId').notNull().references(() => questions.id),
        resultId: uuid('resultId').notNull().references(() => results.id),
        segmentValueId: uuid('segmentValueId').notNull().references(() => segmentValues.id),
    },
    (t) => [primaryKey({ columns: [t.answerId, t.questionId, t.resultId, t.segmentValueId] })],
);

export const questionDataRelations = relations(questionData, ({ one }) => ({
    answer: one(answers, {
        fields: [questionData.answerId],
        references: [answers.id]
    }),
    question: one(questions, {
        fields: [questionData.questionId],
        references: [questions.id]
    }),
    result: one(results, {
        fields: [questionData.resultId],
        references: [results.id]
    }),
    segmentValue: one(segmentValues, {
        fields: [questionData.segmentValueId],
        references: [segmentValues.id]
    }),
}));