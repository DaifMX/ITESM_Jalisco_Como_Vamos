import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users, questions, commentLikes } from "@/db/schema";

export const comments = pgTable('comments', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    msgContent: text('msgContent').notNull(),
    questionId: uuid('questionId').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
    userId: text('userId').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const commentRelations = relations(comments, ({ one, many }) => ({
    question: one(questions, {
        fields: [comments.questionId],
        references: [questions.id]
    }),
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    likes: many(commentLikes)
}));

export const commentSelectSchema = createSelectSchema(comments);

export const commentInsertSchema = createInsertSchema(comments);