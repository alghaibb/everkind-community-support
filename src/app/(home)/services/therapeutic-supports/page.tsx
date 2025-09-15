import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Therapeutic Supports | Services",
  description:
    "Allied health and therapeutic support services including physiotherapy, occupational therapy, speech therapy, and wellness programs. Professional therapeutic care.",
  keywords: [
    "Therapeutic Supports",
    "Allied Health",
    "Physiotherapy",
    "Occupational Therapy",
    "Speech Therapy",
    "Rehabilitation",
    "NDIS Therapy",
  ],
};

export default function TherapeuticSupportsPage() {
  const serviceData = {
    title: "Therapeutic Supports",
    subtitle: "Professional Allied Health Services",
    description:
      "Our therapeutic support services provide access to qualified allied health professionals who work with you to achieve your health and wellbeing goals through evidence-based interventions.",
    features: [
      {
        title: "Allied Health",
        description:
          "Access to physiotherapists, occupational therapists, and speech pathologists",
      },
      {
        title: "Therapy Sessions",
        description:
          "Individual and group therapy sessions tailored to your specific needs",
      },
      {
        title: "Rehabilitation",
        description:
          "Comprehensive rehabilitation programs to improve function and independence",
      },
      {
        title: "Wellness Programs",
        description:
          "Holistic wellness programs focusing on physical and mental health",
      },
    ],
    benefits: [
      "Access to qualified allied health professionals",
      "Evidence-based therapeutic interventions",
      "Personalized treatment plans",
      "Improved functional outcomes",
      "Coordination with healthcare providers",
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
