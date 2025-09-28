import { Resend } from "resend";
import { render } from "@react-email/components";
import WelcomeEmail from "@/components/emails/welcome-email";
import RejectionEmail from "@/components/emails/rejection-email";
import ReplyEmail from "@/components/emails/reply-email";
import PasswordResetEmail from "@/components/emails/password-reset-email";
import { env } from "./env";

const resend = new Resend(env.RESEND_API_KEY);

interface WelcomeEmailData {
  to: string;
  name: string;
  email: string;
  tempPassword: string;
  loginUrl: string;
}

interface RejectionEmailData {
  to: string;
  name: string;
  role: string;
  applicationDate: string;
}

interface ReplyEmailData {
  to: string;
  toName: string;
  subject: string;
  message: string;
  originalMessage: {
    subject: string;
    message: string;
    createdAt: Date;
  };
}

interface PasswordResetEmailData {
  to: string;
  name: string;
  resetUrl: string;
}

export async function sendWelcomeEmail({
  to,
  name,
  email,
  tempPassword,
  loginUrl,
}: WelcomeEmailData) {
  const emailHtml = await render(
    WelcomeEmail({ name, email, tempPassword, loginUrl })
  );

  return await resend.emails.send({
    from: "EverKind Community Support <noreply@ekcs.com.au>",
    to,
    subject: "Welcome to EverKind Community Support - Staff Portal Access",
    html: emailHtml,
  });
}

export async function sendRejectionEmail({
  to,
  name,
  role,
  applicationDate,
}: RejectionEmailData) {
  const emailHtml = await render(
    RejectionEmail({ applicantName: name, role, applicationDate })
  );

  return await resend.emails.send({
    from: "EverKind Community Support <noreply@ekcs.com.au>",
    to,
    subject: "Application Rejected - EverKind Community Support",
    html: emailHtml,
  });
}

export async function sendReplyEmail({
  to,
  toName,
  subject,
  message,
  originalMessage,
}: ReplyEmailData) {
  const emailHtml = await render(
    ReplyEmail({
      recipientName: toName,
      replyMessage: message,
      originalSubject: originalMessage.subject,
      originalMessage: originalMessage.message,
      originalDate: originalMessage.createdAt,
    })
  );

  return await resend.emails.send({
    from: "EverKind Community Support <noreply@ekcs.com.au>",
    to,
    subject,
    html: emailHtml,
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailData) {
  const emailHtml = await render(PasswordResetEmail({ name, resetUrl }));

  return await resend.emails.send({
    from: "EverKind Community Support <noreply@ekcs.com.au>",
    to,
    subject: "Reset your password - EverKind Community Support",
    html: emailHtml,
  });
}
