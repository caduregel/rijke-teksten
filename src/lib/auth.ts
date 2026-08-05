import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendMagicLinkEmail } from "@/lib/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  // Passwordless only: visitors sign in with a magic link sent to their email.
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    magicLink({
      // Default is 5 minutes, which is too short while there's no real email
      // provider wired up and links are relayed manually from the Vercel logs.
      expiresIn: 60 * 60,
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "free",
        input: false,
      },
    },
  },
  // Store rate limit counters in the DB so limits survive across serverless
  // invocations (in-memory storage would reset on every cold start on Vercel).
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "rateLimit",
    window: 60,
    max: 100,
    customRules: {
      // Sending a magic-link email is the expensive/abusable action here.
      "/sign-in/magic-link": {
        window: 60 * 10,
        max: 3,
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
