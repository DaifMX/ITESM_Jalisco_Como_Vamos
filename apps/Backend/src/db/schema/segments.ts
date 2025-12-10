import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { segmentValues } from '@/db/schema';

export const segments = pgTable('segments', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').unique().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const segmentRelations = relations(segments, ({ many }) => ({
    segmentValues: many(segmentValues)
}));