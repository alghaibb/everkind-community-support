import ParticipantsPageContent from "./_components/ParticipantsPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Participants",
  description: "NDIS participants",
};

export default function ParticipantsPage() {
  return <ParticipantsPageContent />;
}
