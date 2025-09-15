import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Nursing Care | Services",
  description:
    "Professional nursing care services including wound care, medication administration, health assessments, and clinical support by registered nurses.",
  keywords: [
    "Nursing Care",
    "Clinical Support",
    "Wound Care",
    "Medication Administration",
    "Health Assessments",
    "Registered Nurses",
    "NDIS Nursing",
  ],
};

export default function NursingCarePage() {
  const serviceData = {
    title: "Nursing Care",
    subtitle: "Professional Clinical Support",
    description:
      "Our nursing care services are provided by qualified registered nurses who deliver professional clinical support in the comfort of your own home or community setting.",
    features: [
      {
        title: "Wound Care",
        description:
          "Professional wound assessment, dressing changes, and healing monitoring",
      },
      {
        title: "Medication Administration",
        description:
          "Safe medication management and administration by qualified nurses",
      },
      {
        title: "Health Assessments",
        description:
          "Regular health monitoring and comprehensive wellness evaluations",
      },
      {
        title: "Clinical Support",
        description:
          "Specialized nursing interventions and clinical care coordination",
      },
    ],
    benefits: [
      "Qualified registered nurses",
      "Clinical expertise and experience",
      "Coordination with healthcare providers",
      "Person-centered care planning",
      "Emergency response protocols",
    ],
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <ServiceDetailHero
          title={serviceData.title}
          subtitle={serviceData.subtitle}
          description={serviceData.description}
        />
        <ServiceDetailContent
          features={serviceData.features}
          benefits={serviceData.benefits}
        />
        <ServiceDetailCTA />
      </div>
    </ErrorBoundary>
  );
}
