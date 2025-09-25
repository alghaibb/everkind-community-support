import { env } from "@/lib/env";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Img,
  Link,
} from "@react-email/components";
import { format } from "date-fns";
import { CSSProperties } from "react";

interface ReplyEmailProps {
  recipientName: string;
  replyMessage: string;
  originalSubject: string;
  originalMessage: string;
  originalDate: Date;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export function ReplyEmail({
  recipientName,
  replyMessage: replyMessageProp,
  originalSubject,
  originalMessage,
  originalDate,
}: ReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/ekcs-logo.png`}
              width="120"
              height="40"
              alt="EverKind Community Support"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>
              Thank you for contacting EverKind Community Support
            </Heading>

            <Text style={paragraph}>Dear {recipientName},</Text>

            <Text style={paragraph}>
              Thank you for reaching out to us. We have received your message
              and one of our team members has responded below:
            </Text>

            {/* Reply Message */}
            <Section style={replySection}>
              <Text style={replyMessage as CSSProperties}>
                {replyMessageProp}
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Original Message Reference */}
            <Section style={originalMessageSection}>
              <Text style={originalMessageHeader}>
                <strong>Your original message:</strong>
              </Text>
              <Text style={originalMessageMeta}>
                <strong>Subject:</strong> {originalSubject}
                <br />
                <strong>Sent:</strong> {format(originalDate, "PPP 'at' p")}
              </Text>
              <Text style={originalMessageContent as CSSProperties}>
                {originalMessage}
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={paragraph}>
              If you have any further questions or need additional assistance,
              please don&apos;t hesitate to contact us.
            </Text>

            <Text style={paragraph}>
              Best regards,
              <br />
              <strong>The EverKind Community Support Team</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              EverKind Community Support
              <br />
              Phone:{" "}
              <Link href="tel:1300453766" style={link}>
                1300 453 766
              </Link>
              <br />
              Email:{" "}
              <Link href="mailto:support@ekcs.com.au" style={link}>
                support@ekcs.com.au
              </Link>
              <br />
              Web:{" "}
              <Link href={`${baseUrl}`} style={link}>
                ekcs.com.au
              </Link>
            </Text>
            <Text style={footerDisclaimer}>
              This email was sent in response to your inquiry. Please do not
              reply to this email directly. If you need further assistance,
              please contact us using the details above.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "24px 24px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "24px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#374151",
  margin: "0 0 16px",
};

const replySection = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  borderLeft: "4px solid #3b82f6",
};

const replyMessage = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#1f2937",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const originalMessageSection = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "16px",
  margin: "16px 0",
};

const originalMessageHeader = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 8px",
};

const originalMessageMeta = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0 0 12px",
  lineHeight: "1.4",
};

const originalMessageContent = {
  fontSize: "14px",
  color: "#4b5563",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  lineHeight: "1.5",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  padding: "24px",
  borderTop: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
};

const footerText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#6b7280",
  margin: "0 0 12px",
  textAlign: "center" as const,
};

const footerDisclaimer = {
  fontSize: "12px",
  lineHeight: "1.4",
  color: "#9ca3af",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#3b82f6",
  textDecoration: "none",
};

export default ReplyEmail;
