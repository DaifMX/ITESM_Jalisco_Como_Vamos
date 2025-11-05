import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm";

import { questionData } from "@/db/schema";

export const answers = pgTable('answers', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    value: text('value').notNull().unique(),
});

export const answerRelations = relations(answers, ({ many }) => ({
    questionData: many(questionData),
}));