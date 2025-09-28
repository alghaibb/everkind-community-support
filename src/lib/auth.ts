import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendPasswordResetEmail } from "./email-service";
import prisma from "./prisma";
import { env } from "./env";

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
    sendResetPassword: async ({
      user,
      token,
    }: {
      user: { email: string; name: string };
      token: string;
    }) => {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl: `${env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`,
      });
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
