import { pgTable, uuid, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users, comments } from "@/db/schema";

export const commentLikes = pgTable('commentLikes', {
    commentId: uuid('commentId').references(() => comments.id, { onDelete: 'cascade' }).notNull(),
    userId: text('userId').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.commentId, table.userId] })
}));

export const commentLikeRelations = relations(commentLikes, ({ one }) => ({
    comment: one(comments, {
        fields: [commentLikes.commentId],
        references: [comments.id]
    }),
    user: one(users, {
        fields: [commentLikes.userId],
        references: [users.id]
    })
}));

export const commentLikeSelectSchema = createSelectSchema(commentLikes);

export const commentLikeInsertSchema = createInsertSchema(commentLikes);
