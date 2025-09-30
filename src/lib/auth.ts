import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendPasswordResetEmail } from "./email-service";
import prisma from "./prisma";
import { env } from "./env";
import { createAuthMiddleware, APIError } from "better-auth/api";
import {
  passwordSchema,
  nameSchema,
  emailSchema,
} from "./validations/shared.schema";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      userType: {
        type: "string",
        defaultValue: "INTERNAL",
        input: false,
      },
      role: {
        type: "string",
        defaultValue: "STAFF",
        input: false,
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
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const { path, body } = ctx;

      if (
        path === "/sign-up/email" ||
        path === "/reset-password" ||
        path === "/change-password"
      ) {
        const password = body?.password || body?.newPassword;
        const { error } = passwordSchema.safeParse(password);

        if (error) {
          throw new APIError("BAD_REQUEST", {
            message:
              (error as { errors?: { message?: string }[] }).errors?.[0]
                ?.message || "Password not strong enough",
          });
        }
      }

      // Validate email for sign-up and sign-in
      if (path === "/sign-up/email" || path === "/sign-in/email") {
        const { error } = emailSchema.safeParse(body?.email);

        if (error) {
          throw new APIError("BAD_REQUEST", {
            message:
              (error as { errors?: { message?: string }[] }).errors?.[0]
                ?.message || "Invalid email address",
          });
        }
      }

      // Validate name for sign-up
      if (path === "/sign-up/email") {
        const { error } = nameSchema.safeParse(body?.name);

        if (error) {
          console.error("Name validation error in auth hook:", error);
          throw new APIError("BAD_REQUEST", {
            message:
              (error as { errors?: { message?: string }[] }).errors?.[0]
                ?.message || "Invalid name",
          });
        }
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
