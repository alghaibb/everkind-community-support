import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import PWAPrompt from "@/components/pwa-prompt";
import PWARegister from "@/components/pwa-register";
import { QueryProvider } from "@/providers/query-provider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap", // Faster font loading
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | EverKind Community Support",
    absolute: "EverKind Community Support",
  },
  description:
    "EverKind Community Support is an NDIS provider that provides support. We strive to promote independence, choice and control for our clients.",
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
    "ekcs",
    "everkind community support",
    "everkind community support ndis",
    "everkind community support ndis provider",
    "everkind community support ndis support",
    "everkind community support ndis independence",
    "everkind community support ndis choice",
    "everkind community support ndis control",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EKCS",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="EKCS" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for faster lookups */}
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
          <Toaster richColors closeButton theme="light" />
          <PWAPrompt />
          <PWARegister />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
