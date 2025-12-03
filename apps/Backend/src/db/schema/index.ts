import { drizzle } from 'drizzle-orm/node-postgres';

// Drizzle instance
const db = drizzle(process.env.DATABASE_URL!);
export default db;

// Schemas
export * from "@/db/schema/answers";
export * from "@/db/schema/categories";
export * from "@/db/schema/comments";
export * from "@/db/schema/commentLikes";
export * from "@/db/schema/questionData";
export * from "@/db/schema/questions";
export * from "@/db/schema/segments";
export * from "@/db/schema/segmentValues";

// Better-Auth Schemas
export * from "@/db/schema/accounts"
export * from "@/db/schema/sessions"
export * from "@/db/schema/twoFactors";
export * from "@/db/schema/users";
export * from "@/db/schema/verifications";