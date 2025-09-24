import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  tempPassword: string;
  loginUrl: string;
}

export default function WelcomeEmail({
  name,
  tempPassword,
  loginUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to EverKind Community Support</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to EverKind Community Support</Heading>

          <Text style={text}>Hello {name},</Text>

          <Text style={text}>
            Your staff account has been created successfully. Please use the
            following credentials to log in:
          </Text>

          <Text style={text}>
            <strong>Email:</strong> Your registered email
            <br />
            <strong>Temporary Password:</strong> {tempPassword}
          </Text>

          <Text style={text}>
            <Link href={loginUrl} style={link}>
              Click here to login to the staff portal
            </Link>
          </Text>

          <Text style={text}>
            For security reasons, you will be required to change your password
            on first login.
          </Text>

          <Text style={text}>
            If you have any questions, please contact your administrator.
          </Text>

          <Text style={text}>
            Best regards,
            <br />
            EverKind Community Support Team
          </Text>
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
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};
