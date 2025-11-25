CREATE TABLE "twoFactors" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backupCodes" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "passkeys" CASCADE;--> statement-breakpoint
ALTER TABLE "twoFactors" ADD CONSTRAINT "twoFactors_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "twoFactors_secret_idx" ON "twoFactors" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "twoFactors_userId_idx" ON "twoFactors" USING btree ("userId");