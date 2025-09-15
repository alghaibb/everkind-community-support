import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Personal Activities | Services",
  description:
    "Professional personal care services including assistance with daily living activities, personal hygiene, medication support, and health monitoring. NDIS approved provider.",
  keywords: [
    "Personal Activities",
    "Daily Living Support",
    "Personal Hygiene",
    "Medication Management",
    "Health Monitoring",
    "NDIS Personal Activities",
    "Disability Support",
  ],
};

export default function PersonalActivitiesPage() {
  const serviceData = {
    title: "Personal Activities",
    subtitle: "Supporting Your Daily Living",
    description:
      "Our personal activities services are designed to help you maintain your independence while ensuring your health, safety, and wellbeing. Our trained support workers provide compassionate assistance with daily living activities.",
    features: [
      {
        title: "Personal Hygiene",
        description:
          "Assistance with showering, grooming, and personal care routines",
      },
      {
        title: "Medication Management",
        description:
          "Support with medication reminders and administration as prescribed",
      },
      {
        title: "Health Monitoring",
        description:
          "Regular health checks and monitoring of vital signs when required",
      },
      {
        title: "Mobility Support",
        description:
          "Assistance with transfers, walking aids, and mobility equipment",
      },
    ],
    benefits: [
      "Maintain dignity and independence",
      "Professional, trained support workers",
      "Flexible scheduling to suit your needs",
      "Person-centered approach to activities",
      "Regular care plan reviews",
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
