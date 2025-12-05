import { Suspense } from "react";
import { Metadata } from "next";
import { ParticipantsContent } from "./_components/ParticipantsContent";
import { ParticipantsSkeleton } from "./_components/ParticipantsSkeleton";

export const metadata: Metadata = {
  title: "My Participants | EverKind Staff",
  description: "View your assigned participants",
};

export default function StaffParticipantsPage() {
  return (
    <Suspense fallback={<ParticipantsSkeleton />}>
      <ParticipantsContent />
    </Suspense>
  );
}
