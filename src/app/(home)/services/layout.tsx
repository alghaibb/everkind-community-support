import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Services | EverKind Community Support",
    default: "Services | EverKind Community Support",
  },
};

/**
 * Services Layout
 * Shared layout for all service pages with consistent metadata structure
 */
export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
