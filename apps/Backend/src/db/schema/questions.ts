import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { categories, questionData } from '@/db/schema';

export const questions = pgTable('questions', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    xlsxCode: text('xlsxCode').notNull().unique(),
    value: text('value').notNull(),
    valueShort: text('valueShort'),
    categoryId: uuid('categoryId').notNull().references(() => categories.id)
});

export const questionRelations = relations(questions, ({ one, many }) => ({
    category: one(categories, {
        fields: [questions.categoryId],
        references: [categories.id],
    }),
    questionData: many(questionData),
}));

export const questionSelectSchema = createSelectSchema(questions);

export const questionInsertSchema = createInsertSchema(questions);