import { APIError, betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";

import { admin, twoFactor } from "better-auth/plugins";
import { expo } from "@better-auth/expo";

import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db, { accounts, users, verifications, sessions, twoFactors } from "@/db/schema";

import getTrustedOrigins from "@/utils/getTrustedOrigins";

export const auth = betterAuth({
  appName: 'Jalisco Como Vamos',
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins() ?? [],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true, // false in dev, true in production
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    camelCase: true,
    schema: {
      accounts,
      sessions,
      verifications,
      users,
      twoFactors,
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
    deleteUser: {
      enabled: true
    },
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
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Check if this is a sign-in request
      if (ctx.path !== "/sign-in/email") {
        return;
      }

      // Check if this request is coming from the Admin Panel
      const isAdminLogin = ctx.headers?.get("x-admin-login") === "true";
      
      if (!isAdminLogin) {
        // Not an admin login request, allow normal flow
        return;
      }

      // Admin login - we'll check the role after authentication in the 'after' hook
    }),
    after: createAuthMiddleware(async (ctx) => {
      // Only check after sign-in
      if (ctx.path !== "/sign-in/email") {
        return;
      }

      const isAdminLogin = ctx.headers?.get("x-admin-login") === "true";
      
      if (!isAdminLogin) {
        // Not an admin login, allow normal flow
        return;
      }

      // Get the user from the context
      const user = ctx.context.newSession?.user;
      
      if (!user) {
        throw new APIError("UNAUTHORIZED", {
          message: "Authentication failed",
        });
      }

      // Check if user has admin role
      if (user.role !== "admin") {
        throw new APIError("FORBIDDEN", {
          message: "Access Denied: You do not have admin privileges.",
        });
      }
    }),
  },
});