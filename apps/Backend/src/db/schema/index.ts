import { drizzle } from 'drizzle-orm/node-postgres';

// Drizzle instance
const db = drizzle(process.env.DATABASE_URL!);
export default db;

// Schemas
export * from "@/db/schema/categories";
export * from "@/db/schema/questions";
export * from "@/db/schema/questionData";

// Better-Auth Schemas
export * from "@/db/schema/accounts"
export * from "@/db/schema/sessions"
export * from "@/db/schema/users";
export * from "@/db/schema/verifications";