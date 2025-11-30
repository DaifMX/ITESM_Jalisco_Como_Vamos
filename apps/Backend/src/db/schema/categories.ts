import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { questions } from '@/db/schema';

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').unique(),
    icon: text('icon'),
    color: text('color'),
});

export const categoryRelations = relations(categories, ({ many }) => ({
    question: many(questions),
}));