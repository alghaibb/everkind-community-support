import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Daily Tasks | Services",
  description:
    "Daily task support services to help with daily activities and routines. Build independence and maintain quality of life with personalized assistance.",
  keywords: [
    "Daily Tasks",
    "Daily Activities",
    "Routine Support",
    "Independence Training",
    "Task Management",
    "NDIS Daily Support",
    "Personal Assistance",
  ],
};

export default function DailyTasksPage() {
  const serviceData = {
    title: "Daily Tasks",
    subtitle: "Supporting Your Daily Routines",
    description:
      "Our daily task support services help you manage your daily activities and routines with confidence. We provide personalized assistance to help you maintain independence and improve your quality of life.",
    features: [
      {
        title: "Daily Routines",
        description:
          "Support with establishing and maintaining healthy daily routines",
      },
      {
        title: "Task Management",
        description:
          "Assistance with organizing and completing daily tasks efficiently",
      },
      {
        title: "Skill Building",
        description:
          "Training to develop skills for greater independence in daily activities",
      },
      {
        title: "Independence Support",
        description:
          "Gradual reduction of support as you build confidence and skills",
      },
    ],
    benefits: [
      "Develop consistent daily routines",
      "Build confidence in task completion",
      "Improve time management skills",
      "Increase overall independence",
      "Personalized support approach",
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
