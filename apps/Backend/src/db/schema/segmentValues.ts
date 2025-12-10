import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { segments, questionData } from '@/db/schema';

export const segmentValues = pgTable('segmentValues', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').unique().notNull(),
    segmentId: uuid('segmentId').notNull().references(() => segments.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const segmentValueRelations = relations(segmentValues, ({ one, many }) => ({
    segment: one(segments, {
        fields: [segmentValues.segmentId],
        references: [segments.id],
    }),
    questionData: many(questionData),
}));