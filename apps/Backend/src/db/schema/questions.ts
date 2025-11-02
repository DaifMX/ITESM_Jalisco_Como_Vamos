import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { category } from '@/db/schema';

export const question = pgTable('questions', {
    id: uuid(),
    xlsxCode: text().unique(),
    question: text(),
    categoryId: uuid('category_id')
});

export const questionRelations = relations(question, ({ one }) => ({
    category: one(category, {
        fields: [question.categoryId],
        references: [category.id],
    })
}));