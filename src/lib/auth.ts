import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      userType: {
        type: "string",
        required: false,
        defaultValue: "INTERNAL",
      },
      role: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
