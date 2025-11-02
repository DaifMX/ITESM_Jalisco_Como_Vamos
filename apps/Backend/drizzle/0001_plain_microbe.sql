ALTER TABLE "sessions" RENAME COLUMN "expires_at" TO "expiresAt";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "ip_address" TO "ipAddress";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "user_agent" TO "userAgent";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "email_verified" TO "emailVerified";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "impersonatedBy" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banReason" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banExpires" timestamp;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;