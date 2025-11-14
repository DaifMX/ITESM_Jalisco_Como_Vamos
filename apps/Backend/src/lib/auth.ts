import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { expo } from "@better-auth/expo";

import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db, { users, verifications, accounts, sessions } from "@/db/schema";

import getTrustedOrigins from "@/utils/getTrustedOrigins";

export const auth = betterAuth({
  appName: 'Jalisco Como Vamos',
  trustedOrigins: getTrustedOrigins() ?? [],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    camelCase: true,
    schema: {
      accounts,
      sessions,
      verifications,
      users
    },
  }),
  plugins: [
    admin() as any,
    expo(),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    changeEmail: {
      enabled: true,
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  },
}); 