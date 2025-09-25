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

interface RejectionEmailProps {
  applicantName: string;
  role: string;
  applicationDate: string;
}

const bareUrl = env.NEXT_PUBLIC_BASE_URL;

export default function RejectionEmail({
  applicantName,
  role,
  applicationDate,
}: RejectionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Thank you for your interest in joining EverKind Community Support
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
            <Text style={heading}>Thank You for Your Application</Text>

            <Text style={paragraph}>Dear {applicantName},</Text>

            <Text style={paragraph}>
              Thank you for taking the time to apply for the{" "}
              <strong>{role}</strong> position with EverKind Community Support.
              We appreciate your interest in joining our team and the effort you
              put into your application submitted on {applicationDate}.
            </Text>

            <Text style={paragraph}>
              After careful consideration, we have decided to move forward with
              other candidates whose experience and qualifications more closely
              align with our current needs for this particular role.
            </Text>

            <Text style={paragraph}>
              Please know that this decision was not made lightly, and your
              qualifications are valued. We encourage you to continue monitoring
              our career opportunities as we frequently have new openings that
              may be a better fit for your skills and experience.
            </Text>

            <Section style={buttonContainer}>
              <Link style={button} href={`${bareUrl}/careers`}>
                View Current Opportunities
              </Link>
            </Section>

            <Text style={paragraph}>
              We wish you the very best in your career search and future
              endeavors.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Best regards,
              <br />
              <strong>EverKind Community Support Team</strong>
              <br />
              <Link href="mailto:careers@ekcs.com.au" style={link}>
                careers@ekcs.com.au
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

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#3b82f6",
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
