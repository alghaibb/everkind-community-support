import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Travel & Transport | Services",
  description:
    "Reliable transport support services for medical appointments, social activities, shopping trips, and community events. Safe and professional drivers.",
  keywords: [
    "Travel & Transport",
    "Medical Transport",
    "Social Outings",
    "Shopping Trips",
    "Community Transport",
    "NDIS Travel & Transport",
    "Disability Transport",
  ],
};

export default function TransportSupportPage() {
  const serviceData = {
    title: "Travel & Transport",
    subtitle: "Getting You Where You Need to Go",
    description:
      "Our travel & transport services provide safe, reliable transportation to help you access the community, attend appointments, and participate in activities that matter to you.",
    features: [
      {
        title: "Medical Appointments",
        description:
          "Safe transport to medical, dental, and specialist appointments",
      },
      {
        title: "Social Outings",
        description:
          "Transport to social activities, events, and recreational programs",
      },
      {
        title: "Shopping Trips",
        description: "Assistance with grocery shopping and essential errands",
      },
      {
        title: "Community Events",
        description:
          "Transport to community gatherings, cultural events, and activities",
      },
    ],
    benefits: [
      "Professional and trained drivers",
      "Wheelchair accessible vehicles available",
      "Flexible scheduling and booking",
      "Door-to-door service",
      "Companion support during trips",
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
