import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServicesHero from "./_components/ServicesHero";
import ServicesGrid from "./_components/ServicesGrid";
import ServicesCTA from "./_components/ServicesCTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Comprehensive NDIS support services including personal care, community access, household tasks, transport support, and nursing care. Empowering independence and choice.",
  keywords: [
    "NDIS Services",
    "Personal Care",
    "Community Access",
    "Household Tasks",
    "Transport Support",
    "Nursing Care",
    "Disability Support",
    "Melbourne NDIS",
  ],
};

export default function ServicesPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <ServicesHero />
        <ServicesGrid />
        <ServicesCTA />
      </div>
    </ErrorBoundary>
  );
}
