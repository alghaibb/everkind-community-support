import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Group Activities | Services",
  description:
    "Structured group programs and activities to build social connections, develop skills, and participate in community life. Supportive group environments.",
  keywords: [
    "Group Activities",
    "Social Groups",
    "Skill Development",
    "Peer Support",
    "Community Programs",
    "NDIS Group Support",
    "Social Participation",
  ],
};

export default function GroupActivitiesPage() {
  const serviceData = {
    title: "Group Activities",
    subtitle: "Building Connections Through Shared Experiences",
    description:
      "Our group activity programs provide opportunities to connect with others, develop new skills, and participate in meaningful activities. We create supportive environments where lasting friendships can flourish.",
    features: [
      {
        title: "Social Groups",
        description:
          "Regular social meetups and friendship groups with shared interests",
      },
      {
        title: "Skill Development",
        description:
          "Group-based learning programs to develop practical and social skills",
      },
      {
        title: "Peer Support",
        description:
          "Connect with others who share similar experiences and challenges",
      },
      {
        title: "Recreational Activities",
        description:
          "Fun and engaging activities including sports, arts, and hobbies",
      },
    ],
    benefits: [
      "Build lasting friendships and connections",
      "Learn new skills in supportive environments",
      "Reduce social isolation",
      "Gain confidence through group participation",
      "Access to diverse recreational opportunities",
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
