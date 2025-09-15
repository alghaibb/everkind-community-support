import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Community Participation | Services",
  description:
    "Community access support services helping you participate in social activities, recreational programs, and community events. Build connections and develop skills.",
  keywords: [
    "Community Participation",
    "Social Activities",
    "Recreation Programs",
    "Community Events",
    "Skill Building",
    "NDIS Community Participation",
    "Social Participation",
  ],
};

export default function CommunityAccessPage() {
  const serviceData = {
    title: "Community Participation",
    subtitle: "Connecting You to Your Community",
    description:
      "Our community participation services help you build meaningful connections, develop new skills, and participate fully in community life. We support you to engage in activities that matter to you.",
    features: [
      {
        title: "Social Activities",
        description:
          "Group activities and social events to build friendships and connections",
      },
      {
        title: "Recreation Programs",
        description:
          "Sports, arts, crafts, and hobby groups tailored to your interests",
      },
      {
        title: "Community Events",
        description:
          "Support to attend local events, festivals, and community gatherings",
      },
      {
        title: "Skill Building",
        description:
          "Programs to develop life skills, communication, and independence",
      },
    ],
    benefits: [
      "Build meaningful social connections",
      "Develop new skills and interests",
      "Increase confidence and independence",
      "Access to diverse community activities",
      "Supportive group environments",
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
