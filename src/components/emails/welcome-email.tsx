import { env } from "@/lib/env";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Img,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  email: string;
  tempPassword: string;
  loginUrl: string;
}

const bareUrl = env.NEXT_PUBLIC_BASE_URL;

export default function WelcomeEmail({
  name,
  email,
  tempPassword,
  loginUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to EverKind Community Support - Staff Portal Access
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={`${bareUrl}/ekcs-logo.png`}
              width="200"
              height="auto"
              alt="EverKind Community Support"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Text style={heading}>Welcome to EverKind Community Support</Text>

            <Text style={paragraph}>Hello {name},</Text>

            <Text style={paragraph}>
              Your staff account has been created successfully. Please use the
              following credentials to log in:
            </Text>

            <Section style={credentialsBox}>
              <Text style={credentialsTitle}>Login Credentials</Text>
              <Text style={credentialsText}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={credentialsText}>
                <strong>Temporary Password:</strong> {tempPassword}
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Link style={button} href={loginUrl}>
                Login to Staff Portal
              </Link>
            </Section>

            <Text style={paragraph}>
              For security reasons, you will be required to change your password
              on first login.
            </Text>

            <Text style={paragraph}>
              If you have any questions, please contact your administrator.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Best regards,
              <br />
              <strong>EverKind Community Support Team</strong>
              <br />
              <Link href="mailto:admin@ekcs.com.au" style={link}>
                admin@ekcs.com.au
              </Link>
              <br />
              <Link href={`${bareUrl}`} style={link}>
                www.ekcs.com.au
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px",
  borderBottom: "1px solid #e6ebf1",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "32px 24px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4b5563",
  marginBottom: "16px",
};

const credentialsBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const credentialsTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const credentialsText = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#374151",
  marginBottom: "8px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#16a34a",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.5",
  textAlign: "center" as const,
};

const link = {
  color: "#3b82f6",
  textDecoration: "none",
};
