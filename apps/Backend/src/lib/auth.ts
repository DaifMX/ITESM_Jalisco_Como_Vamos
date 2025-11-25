import { betterAuth } from "better-auth";

import { admin, twoFactor } from "better-auth/plugins";
import { expo } from "@better-auth/expo";

import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db, { accounts, users, verifications, sessions } from "@/db/schema";

import getTrustedOrigins from "@/utils/getTrustedOrigins";

export const auth = betterAuth({
  appName: 'Jalisco Como Vamos',
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins() ?? [],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    camelCase: true,
    schema: {
      accounts,
      sessions,
      verifications,
      users,
    },
  }),
  plugins: [
    admin() as any,
    expo(),
    twoFactor()
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