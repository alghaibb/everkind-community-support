import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import AboutHero from "./_components/AboutHero";
import AboutMission from "./_components/AboutMission";
import AboutValues from "./_components/AboutValues";
import AboutStats from "./_components/AboutStats";
import AboutCTA from "./_components/AboutCTA";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about EverKind Community Support - our mission, values, and commitment to providing exceptional NDIS support services with compassion and professionalism.",
  keywords: [
    "About EverKind",
    "NDIS Provider",
    "Community Support",
    "Mission",
    "Values",
    "Team",
    "Disability Support",
    "Melbourne NDIS",
  ],
};

// Revalidate about page every 1 hour
export const revalidate = 3600;

/**
 * About Us Page
 * Showcases company mission, values, team, and statistics
 */
export default function AboutUsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <AboutHero />
        <AboutMission />
        <AboutValues />
        <AboutStats />
        <AboutCTA />
      </div>
    </ErrorBoundary>
  );
}
