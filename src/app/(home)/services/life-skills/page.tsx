import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Life Skills | Services",
  description:
    "Life skills development programs to build independence, confidence, and practical abilities. Personalized training in daily living, communication, and social skills.",
  keywords: [
    "Life Skills",
    "Independence Training",
    "Daily Living Skills",
    "Communication Skills",
    "Social Skills",
    "NDIS Life Skills",
    "Skill Development",
  ],
};

export default function LifeSkillsPage() {
  const serviceData = {
    title: "Life Skills",
    subtitle: "Building Independence and Confidence",
    description:
      "Our life skills programs are designed to help you develop the practical abilities and confidence needed to live independently. We provide personalized training and support to help you achieve your goals.",
    features: [
      {
        title: "Daily Living Skills",
        description:
          "Training in cooking, budgeting, time management, and self-care",
      },
      {
        title: "Communication Skills",
        description: "Developing verbal and non-verbal communication abilities",
      },
      {
        title: "Social Skills",
        description:
          "Building confidence in social situations and relationships",
      },
      {
        title: "Problem Solving",
        description:
          "Developing critical thinking and decision-making abilities",
      },
    ],
    benefits: [
      "Increase independence and self-reliance",
      "Build confidence in daily activities",
      "Develop practical life skills",
      "Improve social interactions",
      "Achieve personal goals and aspirations",
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
