import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { question } from '@/db/schema';

export const category = pgTable('categories', {
    id: uuid().primaryKey(),
    name: text().unique()
});

export const categoryRelations = relations(category, ({ many }) => ({
    question: many(question)
}));