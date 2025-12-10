import { index, pgTable, text } from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import { relations } from "drizzle-orm";

export const twoFactors = pgTable(
    "twoFactors",
    {
        id: text("id").primaryKey(),
        secret: text("secret").notNull(),
        backupCodes: text("backupCodes").notNull(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("twoFactors_secret_idx").on(table.secret),
        index("twoFactors_userId_idx").on(table.userId),
    ],
);

export const twoFactorRelations = relations(twoFactors, ({ one }) => ({
  users: one(users, {
    fields: [twoFactors.userId],
    references: [users.id],
  }),
}));