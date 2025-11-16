import { pgTable, uuid, primaryKey, decimal } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

import { answers, questions, segmentValues } from "@/db/schema";

export const questionData = pgTable(
    'questionData',
    {
        answerId: uuid('answerId').notNull().references(() => answers.id),
        questionId: uuid('questionId').notNull().references(() => questions.id),
        segmentValueId: uuid('segmentValueId').notNull().references(() => segmentValues.id),
        result: decimal('result').notNull(),
    },
    (t) => [primaryKey({ columns: [t.answerId, t.questionId, t.segmentValueId] })],
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
    segmentValue: one(segmentValues, {
        fields: [questionData.segmentValueId],
        references: [segmentValues.id]
    }),
}));