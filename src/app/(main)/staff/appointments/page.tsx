import { Suspense } from "react";
import { Metadata } from "next";
import { AppointmentsContent } from "./_components/AppointmentsContent";
import { AppointmentsSkeleton } from "./_components/AppointmentsSkeleton";

export const metadata: Metadata = {
  title: "Appointments | EverKind Staff",
  description: "View your upcoming appointments",
};

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<AppointmentsSkeleton />}>
      <AppointmentsContent />
    </Suspense>
  );
}
