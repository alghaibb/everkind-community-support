import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import ServiceDetailHero from "../_components/ServiceDetailHero";
import ServiceDetailContent from "../_components/ServiceDetailContent";
import ServiceDetailCTA from "../_components/ServiceDetailCTA";

export const metadata: Metadata = {
  title: "Household Tasks | Services",
  description:
    "Household task support services including cleaning, meal preparation, laundry, and home maintenance. Maintain a comfortable and safe living environment.",
  keywords: [
    "Household Tasks",
    "Domestic Support",
    "Cleaning Services",
    "Meal Preparation",
    "Laundry Support",
    "Home Maintenance",
    "NDIS Household Support",
  ],
};

export default function HouseholdTasksPage() {
  const serviceData = {
    title: "Household Tasks",
    subtitle: "Maintaining Your Home Environment",
    description:
      "Our household task services help you maintain a clean, safe, and comfortable living environment. We provide practical support with domestic activities to enhance your quality of life.",
    features: [
      {
        title: "Cleaning Services",
        description:
          "Regular house cleaning, tidying, and maintaining hygiene standards",
      },
      {
        title: "Meal Preparation",
        description: "Planning, shopping for, and preparing nutritious meals",
      },
      {
        title: "Laundry Support",
        description:
          "Washing, drying, ironing, and organizing clothing and linens",
      },
      {
        title: "Home Maintenance",
        description: "Basic maintenance tasks and organizing living spaces",
      },
    ],
    benefits: [
      "Maintain a clean and organized home",
      "Reduce stress and workload",
      "Learn domestic skills and routines",
      "Flexible scheduling options",
      "Professional and reliable service",
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
