ALTER TABLE "accounts" RENAME COLUMN "account_id" TO "accountId";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "provider_id" TO "providerId";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "access_token" TO "accessToken";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "refresh_token" TO "refreshToken";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "access_token_expires_at" TO "accessTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "refresh_token_expires_at" TO "refreshTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;