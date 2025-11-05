import { pgTable, decimal, uuid } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm";

import { questionData } from '@/db/schema';

export const results = pgTable('results', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    value: decimal('value').notNull().unique(),
});

export const resultRelations = relations(results, ({ many }) => ({
    questionData: many(questionData),
}));