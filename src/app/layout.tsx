import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | EverKind Community Support",
    absolute: "EverKind Community Support",
  },
  description:
    "EverKind Community Support is an NDIS provider that providers support. We strive to promote independence, choice and control for our clients.",
  keywords: [
    "EverKind",
    "Community Support",
    "NDIS",
    "Support",
    "Independence",
    "Choice",
    "Control",
    "NDIS Provider",
    "NDIS Support",
    "NDIS Independence",
    "NDIS Choice",
    "NDIS Control",
    "NDIS Provider",
    "NDIS Support",
    "ekcs",
    "everkind community support",
    "everkind community support ndis",
    "everkind community support ndis provider",
    "everkind community support ndis support",
    "everkind community support ndis independence",
    "everkind community support ndis choice",
    "everkind community support ndis control",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors closeButton theme="light" />
        </ThemeProvider>
      </body>
    </html>
  );
}
