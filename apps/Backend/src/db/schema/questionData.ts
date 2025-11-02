import { pgTable, uuid } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const questionData = pgTable('questionData', {
    id: uuid().primaryKey(),
    answerId: uuid(),
    questionId: uuid(),
    segmentValueId: uuid(),
});

export const questionDataRelations = relations(questionData, ({}) => ({

}));