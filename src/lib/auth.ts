import { db } from "@/db";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
    schema: schema,
  }),
  // Disable origin/CSRF verification in development so tools like Postman work smoothly
  advanced: {
    disableCSRFCheck: process.env.NODE_ENV === "development",
  },
  // Allow local development and API testing tools
  trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "candidate",
        input: true, // Prevents users from manually overriding their role during client sign-up
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Guardrail: Force 'admin' requests back to 'candidate' during standard sign-up
          if (user.role === "admin") {
            return {
              data: {
                ...user,
                role: "candidate",
              },
            };
          }
        },
      },
    },
  },
  emailAndPassword: { enabled: true },
});
