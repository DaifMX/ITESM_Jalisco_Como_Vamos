import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import { relations } from "drizzle-orm";

export const passkeys = pgTable("passkeys", {
  id: text("id").primaryKey(),
  name: text("name"),
  publicKey: text("publicKey").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  credentialID: text("credentialID").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("deviceType").notNull(),
  backedUp: boolean("backedUp").notNull(),
  transports: text("transports"),
  createdAt: timestamp("createdAt"),
  aaguid: text("aaguid"),
});

export const passkeyRelations = relations(passkeys, ({ one }) => ({
  users: one(users, {
    fields: [passkeys.userId],
    references: [users.id],
  }),
}));