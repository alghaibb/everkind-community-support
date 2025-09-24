import { Resend } from "resend";
import { render } from "@react-email/components";
import WelcomeEmail from "@/components/emails/welcome-email";
import { env } from "./env";

const resend = new Resend(env.RESEND_API_KEY);

interface WelcomeEmailData {
  to: string;
  name: string;
  tempPassword: string;
  loginUrl: string;
}

export async function sendWelcomeEmail({
  to,
  name,
  tempPassword,
  loginUrl,
}: WelcomeEmailData) {
  const emailHtml = await render(
    WelcomeEmail({ name, tempPassword, loginUrl })
  );

  return await resend.emails.send({
    from: "EverKind Community Support <noreply@ekcs.com.au>",
    to,
    subject: "Welcome to EverKind Community Support - Staff Portal Access",
    html: emailHtml,
  });
}
